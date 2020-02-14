using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Neo.Storage.SQLiteModules
{
    public class Nep5TransactionEntity
    {
        [Key]
        public long Id { get; set; }

        public uint BlockHeight { get; set; }

        public string TxId { get; set; }


        public long AssetId { get; set; }
        public AssetEntity Asset { get; set; }

        public long? FromId { get; set; }

        //[ForeignKey(nameof(FromId))]
        //public AddressEntity From { get; set; }

        //[ForeignKey(nameof(FromId))]
        public AddressEntity From { get; set; }

        public long ToId { get; set; }
        public AddressEntity To { get; set; }

        public byte[] FromBalance { get; set; }
        public byte[] ToBalance { get; set; }
        public byte[] Amount { get; set; }

    
        public DateTime Time { get; set; }

    }
}
