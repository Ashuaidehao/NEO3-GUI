using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Ledger;
using Neo.Models.Transactions;

namespace Neo.Invokers
{
    public class TransactionInvoker : Invoker
    {


        public async Task<object> GetTransaction(string txId)
        {
            var transaction = Blockchain.Singleton.GetTransaction(UInt256.Parse(txId));
            if (transaction != null)
            {
                return new TransactionModel(transaction);
            }
            return $"TxId[{txId}] not found!";
        }
    }
}
