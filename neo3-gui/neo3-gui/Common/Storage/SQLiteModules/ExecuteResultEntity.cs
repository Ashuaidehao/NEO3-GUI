using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Neo.SmartContract;
using Neo.VM;

namespace Neo.Common.Storage.SQLiteModules
{
    
    [Table("ExecuteResult")]
    public class ExecuteResultEntity
    {
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// bin-endian hex string without "0x"
        /// </summary>
        public string TxId { get; set; }

        public TriggerType Trigger { get; set; }
        public VMState VMState { get; set; }
        public long GasConsumed { get; set; }

        /// <summary>
        /// execute result json array
        /// </summary>
        public string ResultStack { get; set; }
        public List<NotifyEventEntity> Notifications { get; set; }
    }
}
