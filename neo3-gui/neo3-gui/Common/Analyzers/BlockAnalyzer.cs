using System;
using System.Collections.Generic;
using System.Linq;
using Neo.Common.Storage;
using Neo.Common.Storage.LevelDBModules;
using Neo.Common.Utility;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;
using Array = Neo.VM.Types.Array;

namespace Neo.Common.Analyzers
{
    public class BlockAnalyzer
    {
        private readonly DataCache _snapshot;
        private readonly Header _header;
        private readonly IReadOnlyList<Blockchain.ApplicationExecuted> _applicationExecutedResults;

        public BlockAnalyzerResult Result = new BlockAnalyzerResult();


        public class BlockAnalyzerResult
        {
            /// <summary>
            /// Execute Result
            /// </summary>
            public readonly List<ExecuteResultInfo> ExecuteResultInfos = new List<ExecuteResultInfo>();

            /// <summary>
            /// "Transfer" info in current block
            /// </summary>
            public readonly List<TransferStorageItem> Transfers = new List<TransferStorageItem>();


            /// <summary>
            /// Contract Create\Update\Destroy info in current block
            /// </summary>
            public readonly IDictionary<UInt256, List<ContractEventInfo>> ContractChangeEvents =
                new Dictionary<UInt256, List<ContractEventInfo>>();

            /// <summary>
            /// relate  asset info in current block
            /// </summary>
            public readonly IDictionary<UInt160, AssetInfo> AssetInfos = new Dictionary<UInt160, AssetInfo>();

            /// <summary>
            /// 
            /// </summary>
            public readonly HashSet<AccountAsset> BalanceChangeAccounts = new HashSet<AccountAsset>();
        }

        public BlockAnalyzer(DataCache snapshot, Header header,
            IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedResults)
        {
            _snapshot = snapshot;
            _header = header;
            _applicationExecutedResults = applicationExecutedResults;
        }



        public void Analysis()
        {
            foreach (var appExec in _applicationExecutedResults)
            {
                AnalysisAppExecuteResult(appExec);
            }
        }



        private void AnalysisAppExecuteResult(Blockchain.ApplicationExecuted appExec)
        {
            var execResult = new ExecuteResultInfo();
            Transaction transaction = appExec.Transaction;
            if (transaction != null)
            {
                //fee account
                Result.BalanceChangeAccounts.Add(new AccountAsset(transaction.Sender, NativeContract.GAS.Hash));
                execResult.TxId = transaction.Hash;
            }

            execResult.Trigger = appExec.Trigger;
            execResult.VMState = appExec.VMState;
            execResult.GasConsumed = appExec.GasConsumed;
            try
            {
                execResult.ResultStack = appExec.Stack.Select(q => q.ToContractParameter().ToJson()).ToArray();
            }
            catch (InvalidOperationException)
            {
                execResult.ResultStack = "error: recursive reference";
            }

            execResult.Notifications = appExec.Notifications.Select(n => n.ToNotificationInfo()).ToList();
            Result.ExecuteResultInfos.Add(execResult);

            foreach (var contract in execResult.Notifications.Select(n => n.Contract).Distinct())
            {
                var asset = AssetCache.GetAssetInfo(contract, _snapshot);
                if (asset != null)
                {
                    Result.AssetInfos[asset.Asset] = asset;
                }
            }

            if (execResult.VMState.HasFlag(VMState.FAULT))
            {
                //no need to track 
                return;
            }

            if (execResult.Notifications.IsEmpty())
            {
                //no need to track
                return;
            }

            foreach (var notification in appExec.Notifications)
            {
                switch (notification.EventName)
                {
                    case "transfer":
                    case "Transfer":
                        ProcessTransfer(notification, appExec);
                        break;
                    case "Deploy":
                        ProcessDeploy(notification, appExec);
                        break;
                    case "Destory":
                        ProcessDestory(notification, appExec);
                        break;
                    default:
                        break;
                }

            }
        }



        private void ProcessTransfer(NotifyEventArgs notification, Blockchain.ApplicationExecuted appExec)
        {
            var transfer = notification.ConvertToTransfer(); // HasTransfer(notification, transaction);
            if (transfer == null)
            {
                return;
            }

            var asset = AssetCache.GetAssetInfo(transfer.Asset, _snapshot);
            if (asset == null)
            {
                return;
            }
            if (transfer.From != null)
            {
                Result.BalanceChangeAccounts.Add(new AccountAsset(transfer.From, transfer.Asset));
            }
            if (transfer.To != null)
            {
                Result.BalanceChangeAccounts.Add(new AccountAsset(transfer.To, transfer.Asset));
            }

            if (appExec.Trigger == TriggerType.Application)
            {
                var transferStorageItem = new TransferStorageItem()
                {
                    From = transfer.From,
                    To = transfer.To,
                    Asset = transfer.Asset,
                    Amount = transfer.Amount,
                    TxId = appExec?.Transaction?.Hash,
                    Trigger = appExec.Trigger,
                };
                Result.Transfers.Add(transferStorageItem);
            }
        }


        private void ProcessDeploy(NotifyEventArgs notification, Blockchain.ApplicationExecuted appExec)
        {
            if (notification.State.Count != 1) { return; }
            var hash = notification.State[0].GetByteSafely();
            if (hash == null || hash.Length != 20) { return; }

            var contractHash = new UInt160(hash);
            if (!Result.ContractChangeEvents.ContainsKey(appExec.Transaction.Hash))
            {
                Result.ContractChangeEvents[appExec.Transaction.Hash] = new List<ContractEventInfo>();
            }
            ContractState contract = NativeContract.ContractManagement.GetContract(_snapshot, contractHash);
            Result.ContractChangeEvents[appExec.Transaction.Hash].Add(new ContractEventInfo() { Contract = contractHash, Name = contract?.Manifest.Name, Event = ContractEventType.Create });
            var asset = AssetCache.GetAssetInfoFromChain(contractHash, _snapshot);
            if (asset != null)
            {
                Result.AssetInfos[asset.Asset] = asset;
            }

        }


        private void ProcessUpdate(NotifyEventArgs notification, Blockchain.ApplicationExecuted appExec)
        {

        }

        private void ProcessDestory(NotifyEventArgs notification, Blockchain.ApplicationExecuted appExec)
        {
            if (notification.State.Count != 1) { return; }
            var contractHash = notification.State[0].GetByteSafely();
            if (contractHash == null || contractHash.Length != 20) { return; }

            var contract = new UInt160(contractHash);
            if (!Result.ContractChangeEvents.ContainsKey(appExec.Transaction.Hash))
            {
                Result.ContractChangeEvents[appExec.Transaction.Hash] = new List<ContractEventInfo>();
            }
            Result.ContractChangeEvents[appExec.Transaction.Hash].Add(new ContractEventInfo() { Contract = contract, Event = ContractEventType.Destroy });
        }
    }
}