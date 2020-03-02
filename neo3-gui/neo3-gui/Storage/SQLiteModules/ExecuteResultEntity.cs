using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.SmartContract;
using Neo.VM;
using Neo.VM.Types;

namespace Neo.Storage.SQLiteModules
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

        public TriggerType Trigger { get; internal set; }
        public VMState VMState { get; internal set; }
        public long GasConsumed { get; internal set; }

        /// <summary>
        /// execute result json array
        /// </summary>
        public string ResultStack { get; internal set; }
        public List<NotifyEventEntity> Notifications { get; internal set; }
    }

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
    }
}
