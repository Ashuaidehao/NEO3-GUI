using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models.Transactions
{
    public class TransactionPreviewModel
    {
        public uint BlockHeight { get; set; }
        public UInt256 Hash { get; set; }
        public DateTime BlockTime => Timestamp.FromTimestampMS().ToLocalTime();
        public ulong Timestamp { get; set; }
        public List<TransferModel> Transfers { get; set; }
    }
}
