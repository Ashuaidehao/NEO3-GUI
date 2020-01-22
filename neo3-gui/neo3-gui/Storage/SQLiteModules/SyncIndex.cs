using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Storage.SQLiteModules
{
    public class SyncIndex
    {
        [Key]
        public uint BlockHeight { get; set; }
    }
}
