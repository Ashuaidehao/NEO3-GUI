using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Common.Storage;
using Neo.Common.Storage.LevelDBModules;
using Neo.Common.Utility;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Transactions;
using Neo.Network.P2P.Payloads;

namespace Neo.Services.ApiServices
{
    public class TransactionApiService : ApiService
    {


        /// <summary>
        /// query transaction info
        /// </summary>
        /// <param name="txId"></param>
        /// <returns></returns>
        public async Task<object> GetTransaction(UInt256 txId)
        {
            var transaction = Blockchain.Singleton.GetTransaction(txId);
            if (transaction == null)
            {
                return Error(ErrorCode.TxIdNotFound);
            }

            var model = new TransactionModel(transaction);

            TransactionState txState = Blockchain.Singleton.View.Transactions.TryGet(txId);
            if (txState != null)
            {
                Header header = Blockchain.Singleton.GetHeader(txState.BlockIndex);
                model.BlockHash = header.Hash;
                model.BlockHeight = txState.BlockIndex;
                model.Timestamp = header.Timestamp;
                model.Confirmations = Blockchain.Singleton.Height - header.Index + 1;
            }
            using var db = new TrackDB();
            var trans = db.FindTransfer(new TrackFilter() { TxIds = new List<UInt256>() { txId }, PageSize = int.MaxValue }).List;
            model.Transfers = trans.Select(tx => tx.ToTransferModel()).ToList();

            var executeResult = db.GetExecuteLog(txId);
            if (executeResult.Notifications.NotEmpty())
            {
                model.Notifies.AddRange(
                    executeResult.Notifications.Select(n => new NotifyModel()
                    {
                        Contract = UInt160.Parse(n.Contract),
                        State = JStackItem.FromJson(n.State),
                    }));
            }
            return model;
        }

        /// <summary>
        /// get all unconfirmed transactions
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        public async Task<object> GetUnconfirmTransactions(int pageIndex = 1, int limit = 100)
        {
            var tempTransactions = UnconfirmedTransactionCache.GetUnconfirmedTransactions(null, pageIndex, limit);
            var result = tempTransactions.Project(t => t.ToTransactionPreviewModel());
            return result;
        }


        public async Task<object> RemoveUnconfirmTransaction(UInt256 txId)
        {
            UnconfirmedTransactionCache.RemoveUnconfirmedTransactions(txId);
            return true;
        }

        /// <summary>
        /// query all transactions(on chain)
        /// </summary>
        /// <returns></returns>
        public async Task<object> QueryTransactions(int pageIndex = 1, int limit = 100, UInt160 address = null, UInt160 asset = null, uint? blockHeight = null)
        {
            var addresses = address != null ? new List<UInt160>() { address } : new List<UInt160>();
            using var db = new TrackDB();
            var trans = db.FindTransactions(new TrackFilter() { FromOrTo = addresses, Asset = asset, BlockHeight = blockHeight, PageIndex = pageIndex, PageSize = limit });
            var result = new PageList<TransactionPreviewModel>
            {
                TotalCount = trans.TotalCount,
                PageSize = trans.PageSize,
                PageIndex = pageIndex,
                List = trans.List?.ToTransactionPreviewModel(),
            };
            return result;
        }

        /// <summary>
        /// query transaction info
        /// </summary>
        /// <returns></returns>
        public async Task<PageList<TransferInfo>> QueryTransfers(TrackFilter filter)
        {
            using var db = new TrackDB();
            var result = db.FindTransfer(filter) as PageList<TransferInfo>;
            return result;
        }



        /// <summary>
        /// GetTransactionLog
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetApplicationLog(UInt256 txId)
        {
            var db = new TrackDB();
            var result = db.GetExecuteLog(txId);
            return result;
        }


        /// <summary>
        /// test
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public async Task<object> Analysis(uint index)
        {
            var result = Program.Starter.ExecuteResultScanner.Sync(index);
            return result;
        }


    }
}
