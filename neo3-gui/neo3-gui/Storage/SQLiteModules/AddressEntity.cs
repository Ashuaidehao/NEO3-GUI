using System.ComponentModel.DataAnnotations;

namespace Neo.Storage.SQLiteModules
{
    public class AddressEntity
    {
        [Key]
        public long Id { get; set; }

        public byte[] Hash { get; set; }
        public string Address { get; set; }
    }
}