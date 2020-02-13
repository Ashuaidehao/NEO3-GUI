using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Storage.SQLiteModules
{
    public class AssetBalanceEntity
    {
        [Key]
        public long Id { get; set; }

        public long AddressId { get; set; }
        public AddressEntity Address { get; set; }

        public long AssetId { get; set; }
        public AssetEntity Asset { get; set; }

        public byte[] Balance { get; set; }
    }
}
