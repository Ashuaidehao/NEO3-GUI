using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Transactions;
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
        public async Task<object> GetTransaction(string txId)
        {
            var transaction = Blockchain.Singleton.GetTransaction(UInt256.Parse(txId));
            if (transaction != null)
            {
                return new TransactionModel(transaction);
            }
            return $"TxId[{txId}] not found!";
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
