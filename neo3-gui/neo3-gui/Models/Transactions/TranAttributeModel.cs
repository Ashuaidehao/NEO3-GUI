using Neo.Network.P2P.Payloads;

namespace Neo.Models.Transactions
{
    public class TranAttributeModel
    {
        public string Type => Usage.ToString();
        public TransactionAttributeUsage Usage { get; set; }
        public byte[] Data { get; set; }
    }
}