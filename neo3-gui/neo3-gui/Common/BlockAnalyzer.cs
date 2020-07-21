using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common.Storage;
using Neo.Common.Utility;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;

namespace Neo.Common
{
    public class BlockAnalyzer
    {
        private readonly StoreView _snapshot;
        private readonly Header _header;
        private readonly IReadOnlyList<Blockchain.ApplicationExecuted> _applicationExecutedResults;

        public BlockAnalyzerResult AnalysisResult = new BlockAnalyzerResult();


        public class BlockAnalyzerResult
        {
            /// <summary>
            /// Execute Result
            /// </summary>
            public readonly List<ExecuteResultInfo> ExecuteResultInfos = new List<ExecuteResultInfo>();

            /// <summary>
            /// "Transfer" info in current block
            /// </summary>
            public readonly IDictionary<UInt256, List<TransferInfo>> Transfers = new Dictionary<UInt256, List<TransferInfo>>();


            /// <summary>
            /// Contract Create\Update\Destroy info in current block
            /// </summary>
            public readonly IDictionary<UInt256, List<ContractEventInfo>> ContractChangeEvents = new Dictionary<UInt256, List<ContractEventInfo>>();

            /// <summary>
            /// relate  asset info in current block
            /// </summary>
            public readonly IDictionary<UInt160, AssetInfo> AssetInfos = new Dictionary<UInt160, AssetInfo>();
            /// <summary>
            /// 
            /// </summary>
            public readonly HashSet<(UInt160 account, UInt160 asset)> BalanceChangeAccounts = new HashSet<(UInt160 account, UInt160 asset)>();
        }

        public BlockAnalyzer(StoreView snapshot, Header header, IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedResults)
        {
            _snapshot = snapshot;
            _header = header;
            _applicationExecutedResults = applicationExecutedResults;
        }



        public void Analysis()
        {
            foreach (var appExec in _applicationExecutedResults.Where(e => e.Transaction != null))
            {
                AnalysisAppExecuteResult(appExec);
            }
        }



        private void AnalysisAppExecuteResult(Blockchain.ApplicationExecuted appExec)
        {
            Transaction transaction = appExec.Transaction;
            //fee account
            AnalysisResult.BalanceChangeAccounts.Add((transaction.Sender, NativeContract.GAS.Hash));
            var execResult = new ExecuteResultInfo();
            execResult.TxId = appExec.Transaction.Hash;
            execResult.Trigger = appExec.Trigger;
            execResult.VMState = appExec.VMState;
            execResult.GasConsumed = appExec.GasConsumed;
            try
            {
                execResult.ResultStack = appExec.Stack.Select(q => q.ToParameter().ToJson()).ToArray();
            }
            catch (InvalidOperationException)
            {
                execResult.ResultStack = "error: recursive reference";
            }
            execResult.Notifications = appExec.Notifications.Select(n => n.ToNotificationInfo()).ToList();
            AnalysisResult.ExecuteResultInfos.Add(execResult);

            foreach (var contract in execResult.Notifications.Select(n => n.Contract).Distinct())
            {
                var asset = AssetCache.GetAssetInfo(contract, _snapshot);
                if (asset != null)
                {
                    AnalysisResult.AssetInfos[asset.Asset] = asset;
                }
            }

            if (execResult.VMState.HasFlag(VMState.FAULT))
            {
                //no need to track 
                return;
            }

            if (_snapshot.Height > 0)
            {
                //Re-execute script
                //using var replaySnapshot = Blockchain.Singleton.GetSnapshot();
                //ApplicationEngine.Run(null, _snapshot, testMode: true);
                var scriptAnalyzer = new ScriptAnalyzerEngine(transaction, _snapshot);
                scriptAnalyzer.LoadScript(transaction.Script);
                scriptAnalyzer.Execute();
                if (scriptAnalyzer.ContractEvents.NotEmpty())
                {
                    AnalysisResult.ContractChangeEvents[transaction.Hash] = scriptAnalyzer.ContractEvents;
                    foreach (var contractEvent in scriptAnalyzer.ContractEvents)
                    {
                        var asset = AssetCache.GetAssetInfo(contractEvent.Contract, _snapshot);
                        if (asset != null)
                        {
                            AnalysisResult.AssetInfos[asset.Asset] = asset;
                        }
                        if (contractEvent.MigrateToContract != null)
                        {
                            var newAsset = AssetCache.GetAssetInfo(contractEvent.MigrateToContract, _snapshot);
                            if (newAsset != null)
                            {
                                AnalysisResult.AssetInfos[newAsset.Asset] = newAsset;
                            }
                        }
                    }
                }
            }


            if (execResult.Notifications.IsEmpty())
            {
                //no need to track transfer
                return;
            }
            var transferList = new List<TransferInfo>();
            foreach (var notification in appExec.Notifications)
            {
                var transfer = HasTransfer(notification, transaction);
                if (transfer != null)
                {
                    transferList.Add(transfer);
                    if (transfer.From != null)
                    {
                        AnalysisResult.BalanceChangeAccounts.Add((transfer.From, transfer.Asset));
                    }

                    if (transfer.To != null)
                    {
                        AnalysisResult.BalanceChangeAccounts.Add((transfer.To, transfer.Asset));
                    }
                }
            }
            AnalysisResult.Transfers[transaction.Hash] = transferList;
        }




        /// <summary>
        /// try to find "Transfer" event, then add record to db
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        private TransferInfo HasTransfer(NotifyEventArgs notification, Transaction transaction)
        {
            if (!"transfer".Equals(notification.EventName, StringComparison.OrdinalIgnoreCase) || notification.State.Count < 3)
            {
                return null;
            }
            var assetHash = notification.ScriptHash;
            var asset = AssetCache.GetAssetInfo(assetHash, _snapshot);
            if (asset == null)
            {
                //not nep5 asset
                return null;
            }
            var notify = notification.State;
            var fromItem = notify[0];
            var toItem = notify[1];
            var amountItem = notify[2];
            if (!fromItem.IsVmNullOrByteArray() || !toItem.IsVmNullOrByteArray())
            {
                return null;
            }
            var from = fromItem.GetByteSafely();
            if (from != null && from.Length != UInt160.Length)
            {
                return null;
            }
            var to = toItem.GetByteSafely();
            if (to != null && to.Length != UInt160.Length)
            {
                return null;
            }
            if (from == null && to == null)
            {
                return null;
            }
            if (amountItem.NotVmByteArray() && amountItem.NotVmInt())
            {
                return null;
            }
            var amount = amountItem.ToBigInteger();
            if (amount == null)
            {
                return null;
            }
            var record = new TransferInfo
            {
                BlockHeight = _header.Index,
                From = from == null ? null : new UInt160(from),
                To = to == null ? null : new UInt160(to),
                Asset = asset.Asset,
                Amount = amount.Value,
                TxId = transaction.Hash,
                TimeStamp = _header.Timestamp,
                //AssetInfo = asset,
            };
            return record;
        }

    }
}
