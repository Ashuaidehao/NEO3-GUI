using System.ComponentModel.DataAnnotations;

namespace Neo.Storage.SQLiteModules
{
    public class AssetEntity
    {
        [Key]
        public long Id { get; set; }
        public byte[] Hash { get; set; }
        public string Asset { get; set; }
    }
}