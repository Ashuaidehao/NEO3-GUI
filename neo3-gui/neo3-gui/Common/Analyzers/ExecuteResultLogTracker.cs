using System;
using System.Collections.Generic;
using System.Linq;
using Neo.Common.Storage;
using Neo.Common.Storage.LevelDBModules;
using Neo.Ledger;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.Plugins;

namespace Neo.Common.Analyzers
{

    public class ExecuteResultLogTracker : Plugin, IPersistencePlugin
    {
        private readonly LevelDbContext _levelDb = new LevelDbContext();

        private readonly HashSet<UInt160> _cachedAssets = new HashSet<UInt160>();

        public void OnPersist(StoreView snapshot, IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedList)
        {
            Header header = snapshot.GetHeader(snapshot.CurrentBlockHash);



            var analyzer = new BlockAnalyzer(snapshot.Clone(), header, applicationExecutedList);
            analyzer.Analysis();

            foreach (var analyzerResultInfo in analyzer.Result.ExecuteResultInfos)
            {
                _levelDb.SaveTxExecuteLog(analyzerResultInfo);
            }
            foreach (var analyzerAssetInfo in analyzer.Result.AssetInfos)
            {
                if (!_cachedAssets.Contains(analyzerAssetInfo.Key))
                {
                    _levelDb.SaveAssetInfo(analyzerAssetInfo.Value);
                    _cachedAssets.Add(analyzerAssetInfo.Key);

                }
            }

            if (analyzer.Result.Transfers.NotEmpty())
            {
                _levelDb.SaveTransfers(snapshot.Height, analyzer.Result.Transfers);
            }

            foreach (var item in analyzer.Result.BalanceChangeAccounts)
            {
                var balance = item.account.GetBalanceOf(item.asset, snapshot);
                _levelDb.UpdateBalance(item.account, item.asset, balance.Value, snapshot.Height);
            }


            if (analyzer.Result.ContractChangeEvents.NotEmpty())
            {
                _levelDb.SaveContractEvent(snapshot.Height, analyzer.Result.ContractChangeEvents);

            }
        }


        public void OnCommit(StoreView snapshot)
        {
            _levelDb.Commit();
        }

        public bool ShouldThrowExceptionFromCommit(Exception ex)
        {
            return false;
        }
    }
}
