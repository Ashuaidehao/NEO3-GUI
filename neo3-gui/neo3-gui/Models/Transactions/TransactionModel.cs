using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Neo.Network.P2P.Payloads;

namespace Neo.Models.Transactions
{
    public class TransactionModel
    {
        public string Hash { get; set; }
        public long NetworkFee { get; set; }

        public uint Nonce { get; set; }

        public string Script { get; set; }

        public string Sender { get; set; }

        public long SystemFee { get; set; }

        public uint ValidUntilBlock { get; set; }

        public byte Version { get; set; }

        public TransactionModel(Transaction tx)
        {
            Hash = tx.Hash.ToString();
            NetworkFee = tx.NetworkFee;
            Nonce = tx.Nonce;
            Script = tx.Script.ToHexString();
            Sender = tx.Sender.ToString();
            SystemFee = tx.SystemFee;
            ValidUntilBlock = tx.ValidUntilBlock;
            Version = tx.Version;
        }

    }
}
