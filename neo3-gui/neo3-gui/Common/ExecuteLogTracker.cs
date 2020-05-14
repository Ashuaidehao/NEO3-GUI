using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Akka.Event;
using Neo.Common.Storage;
using Neo.Common.Storage.LevelDBModules;
using Neo.Common.Utility;
using Neo.IO;
using Neo.IO.Caching;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.Plugins;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;

namespace Neo.Common
{

    public class CloneStoreView : StoreView
    {
        public new Block PersistingBlock { get; set; }

        public CloneStoreView(StoreView view, Block block)
        {
            this.PersistingBlock = block;
            this.Blocks = view.Blocks.CreateSnapshot();
            this.Transactions = view.Transactions.CreateSnapshot();
            this.Contracts = view.Contracts.CreateSnapshot();
            this.Storages = view.Storages.CreateSnapshot();
            this.HeaderHashList = view.HeaderHashList.CreateSnapshot();
            this.BlockHashIndex = view.BlockHashIndex.CreateSnapshot();
            this.HeaderHashIndex = view.HeaderHashIndex.CreateSnapshot();
            this.ContractId = view.ContractId.CreateSnapshot();
        }

        public override DataCache<UInt256, TrimmedBlock> Blocks { get; }
        public override DataCache<UInt256, TransactionState> Transactions { get; }
        public override DataCache<UInt160, ContractState> Contracts { get; }
        public override DataCache<StorageKey, StorageItem> Storages { get; }
        public override DataCache<SerializableWrapper<uint>, HeaderHashList> HeaderHashList { get; }
        public override MetaDataCache<HashIndexState> BlockHashIndex { get; }
        public override MetaDataCache<HashIndexState> HeaderHashIndex { get; }
        public override MetaDataCache<ContractIdState> ContractId { get; }
    }
    public class ExecuteLogTracker : Plugin, IPersistencePlugin
    {
        //private TrackDB _db = new TrackDB();


        private LevelDbContext _levelDb = new LevelDbContext();


        public void OnPersist(StoreView snapshot, IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedList)
        {
            Header header = snapshot.GetHeader(snapshot.CurrentBlockHash);

            var analyzer = new BlockAnalyzer(snapshot, header, applicationExecutedList);
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


            if (analyzer.AnalysisResult.ContractEvents.NotEmpty())
            {
                _levelDb.SaveContractEvent(snapshot.Height, analyzer.AnalysisResult.ContractEvents);
            }
        }
        
        public void OnCommit(StoreView snapshot)
        {
            //_db.Commit();
            _levelDb.Commit();
            //if (_db.LiveTime.TotalSeconds > 15)
            //{
            //    //release memory
            //    _db.Dispose();
            //    _db = new TrackDB();
            //}
        }

        public bool ShouldThrowExceptionFromCommit(Exception ex)
        {
            return false;
        }
    }
}
