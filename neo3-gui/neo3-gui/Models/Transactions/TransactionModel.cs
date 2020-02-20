using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.IO.Json;
using Neo.Network.P2P.Payloads;

namespace Neo.Models.Transactions
{
    public class TransactionModel
    {
        public TransactionModel(Transaction tx)
        {
            Hash = tx.Hash.ToString();
            NetworkFee = tx.NetworkFee;
            Nonce = tx.Nonce;
            Script = tx.Script;
            Sender = tx.Sender;
            SystemFee = tx.SystemFee;
            ValidUntilBlock = tx.ValidUntilBlock;
            Version = tx.Version;
            Size = tx.Size;
            Attributes = tx.Attributes?.Select(a => new TranAttributeModel()
            {
                Usage = a.Usage,
                Data = a.Data,
            }).ToList();
            Witnesses = tx.Witnesses?.Select(w => new WitnessModel()
            {
                VerificationScript = w.VerificationScript,
                InvocationScript = w.InvocationScript,
                ScriptHash = w.ScriptHash,
            }).ToList();
        }
        public string Hash { get; set; }
        public long NetworkFee { get; set; }

        public uint Nonce { get; set; }

        public byte[] Script { get; set; }

        public UInt160 Sender { get; set; }

        public long SystemFee { get; set; }

        public uint ValidUntilBlock { get; set; }

        public byte Version { get; set; }


        public uint Confirmations { get; set; }
        public uint BlockHeight { get; set; }
        public UInt256 BlockHash { get; set; }
        public DateTime BlockTime { get; set; }
        public int Size { get; set; }

        public List<TransferModel> Transfers { get; set; }
        public List<TranAttributeModel> Attributes { get; set; }
        public List<WitnessModel> Witnesses { get; set; }

        public List<NotifyModel> Notifies { get; set; }=new List<NotifyModel>();
    }

    public class NotifyModel
    {
        public string Type { get; set; }
        public object Value { get; set; }
    }

    public class TranAttributeModel
    {
        public TransactionAttributeUsage Usage { get; set; }
        public byte[] Data { get; set; }
    }

    public class WitnessModel
    {
        public byte[] InvocationScript { get; set; }
        public byte[] VerificationScript { get; set; }

        public UInt160 ScriptHash { get; set; }
    }
}
