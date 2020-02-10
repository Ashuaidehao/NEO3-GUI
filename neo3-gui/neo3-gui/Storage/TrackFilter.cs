using System;
using System.Collections.Generic;

namespace Neo.Storage
{
    public class TrackFilter
    {
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public UInt160 From { get; set; }
        public UInt160 To { get; set; }
        public UInt160 AssetId { get; set; }
        public uint? BlockHeight { get; set; }
        public UInt256 TxId { get; set; }

        public UInt160 FromOrTo { get; set; }


        public List<UInt160> FromOrToAddreses { get; set; }
        public List<UInt160> FromAddresses { get; set; }
        public List<UInt160> ToAddresses { get; set; }


        public uint? PageIndex { get; set; }
        public uint? PageSize { get; set; }
    }
}
