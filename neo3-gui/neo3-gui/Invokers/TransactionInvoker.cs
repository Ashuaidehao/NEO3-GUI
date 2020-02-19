using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Neo.Common;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Transactions;
using Neo.Network.P2P.Payloads;
using Neo.Storage;

namespace Neo.Invokers
{
    public class TransactionInvoker : Invoker
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
                return Error(ErrorCode.InvalidTxId);
            }

           
          
            var transactionModel=new TransactionModel(transaction);

            TransactionState txState = Blockchain.Singleton.View.Transactions.TryGet(txId);
            if (txState != null)
            {
                Header header = Blockchain.Singleton.GetHeader(txState.BlockIndex);
                transactionModel.BlockHash = header.Hash;
                transactionModel.BlockHeight = txState.BlockIndex;
                transactionModel.BlockTime = header.Timestamp.FromTimestampMS().ToLocalTime();
                transactionModel.Confirmations = Blockchain.Singleton.Height - header.Index + 1;
            }
            using var db = new TrackDB();
            var trans = db.FindTransfer(new TrackFilter() { TxId = txId }).List;
            transactionModel.Transfers = trans.Select(tx => tx.ToTransferModel()).ToList();
            var notifies = db.GetNotifyEventsByTxId(txId);
            if (notifies.NotEmpty())
            {
                transactionModel.Notifies.AddRange(notifies.Select(n => n.State.DeserializeJson<NotifyModel>()));
            }
            return transactionModel;
        }



        /// <summary>
        /// query transaction info
        /// </summary>
        /// <returns></returns>
        public async Task<PageList<TransferInfo>> QueryTransaction(TrackFilter filter)
        {
            using var db = new TrackDB();
            var result = db.FindTransfer(filter) as PageList<TransferInfo>;
            return result;
        }

    }
}
