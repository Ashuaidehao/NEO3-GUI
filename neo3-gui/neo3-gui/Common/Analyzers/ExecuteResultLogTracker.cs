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

        public void OnPersist(StoreView snapshot, IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedList)
        {
            Header header = snapshot.GetHeader(snapshot.CurrentBlockHash);



            var analyzer = new BlockAnalyzer(snapshot.Clone(), header, applicationExecutedList);
            analyzer.Analysis();

            foreach (var analyzerResultInfo in analyzer.AnalysisResult.ExecuteResultInfos)
            {
                _levelDb.SaveExecuteLog(analyzerResultInfo);
            }
            foreach (var analyzerAssetInfo in analyzer.AnalysisResult.AssetInfos)
            {
                _levelDb.SaveAssetInfo(analyzerAssetInfo.Value);
            }

            foreach (var transaction in analyzer.AnalysisResult.Transfers.Where(t => t.Value.NotEmpty()))
            {
                _levelDb.SaveTransfers(transaction.Key, transaction.Value);
            }

            foreach (var item in analyzer.AnalysisResult.BalanceChangeAccounts)
            {
                var balance = item.account.GetBalanceOf(item.asset, snapshot);
                _levelDb.UpdateBalance(item.account, item.asset, balance.Value, snapshot.Height);
            }


            if (analyzer.AnalysisResult.ContractChangeEvents.NotEmpty())
            {
                _levelDb.SaveContractEvent(snapshot.Height, analyzer.AnalysisResult.ContractChangeEvents);
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
