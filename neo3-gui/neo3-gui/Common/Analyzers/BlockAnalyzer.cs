using System;
using System.Collections.Generic;
using System.Linq;
using Neo.Common.Storage;
using Neo.Common.Utility;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;

namespace Neo.Common.Analyzers
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
                using var replaySnapshot = Blockchain.Singleton.GetSnapshot();
                new Byte[0].RunTestMode(replaySnapshot);
                var scriptAnalyzer = new ScriptAnalyzerEngine(transaction, replaySnapshot);
                scriptAnalyzer.LoadScript(transaction.Script);
                scriptAnalyzer.Execute();
                if (scriptAnalyzer.ContractEvents.NotEmpty())
                {
                    AnalysisResult.ContractChangeEvents[transaction.Hash] = scriptAnalyzer.ContractEvents;
                    foreach (var contractEvent in scriptAnalyzer.ContractEvents)
                    {
                        var asset = AssetCache.GetAssetInfo(contractEvent.Contract, _snapshot, contractEvent.Event != ContractEventType.Create);
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
                var transfer = notification.ConvertToTransfer();// HasTransfer(notification, transaction);
                if (transfer == null)
                {
                    continue;
                }

                var asset = AssetCache.GetAssetInfo(transfer.Asset, _snapshot);
                if (asset == null)
                {
                    continue;
                }

                transferList.Add(new TransferInfo()
                {
                    BlockHeight = _header.Index,
                    From = transfer.From,
                    To = transfer.To,
                    Asset = transfer.Asset,
                    Amount = transfer.Amount,
                    TxId = transaction.Hash,
                    TimeStamp = _header.Timestamp,
                });
                if (transfer.From != null)
                {
                    AnalysisResult.BalanceChangeAccounts.Add((transfer.From, transfer.Asset));
                }

                if (transfer.To != null)
                {
                    AnalysisResult.BalanceChangeAccounts.Add((transfer.To, transfer.Asset));
                }

            }
            AnalysisResult.Transfers[transaction.Hash] = transferList;
        }

    }
}
