using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Neo.Common.Storage.SQLiteModules
{
    [Table("SyncIndex")]
    public class SyncIndex
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public uint BlockHeight { get; set; }
    }
}
