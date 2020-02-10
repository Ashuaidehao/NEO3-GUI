using System.Numerics;

namespace Neo.Storage
{
    public class TransferInfo
    {
        public uint BlockHeight { get; set; }

        public UInt256 TxId { get; set; }
        public UInt160 From { get; set; }
        public UInt160 To { get; set; }

        public BigInteger FromBalance { get; set; }
        public BigInteger ToBalance { get; set; }
        public BigInteger Amount { get; set; }
        public UInt160 AssetId { get; set; }
        public ulong TimeStamp { get; set; }
    }
}
