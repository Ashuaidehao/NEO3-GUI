using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Storage.SQLiteModules
{
    [Table("SyncIndex")]
    public class SyncIndex
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public uint BlockHeight { get; set; }
    }
}
