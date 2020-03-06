using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Neo.Common.Storage.SQLiteModules
{
    [Table("NotifyEvent")]
    public class NotifyEventEntity
    {
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// executing contract,bin-endian hex string without "0x"
        /// </summary>
        public string Contract { get; set; }

        /// <summary>
        /// notify json array
        /// </summary>
        public string State { get; set; }


        public long ExecuteResultId { get; set; }

        public ExecuteResultEntity ExecuteResult { get; set; }
    }
}