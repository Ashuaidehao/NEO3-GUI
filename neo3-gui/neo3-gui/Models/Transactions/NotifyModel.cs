using System.Collections.Generic;
using Neo.VM.Types;

namespace Neo.Models.Transactions
{
    public class NotifyModel
    {
        public UInt160 Contract { get; set; }
        public string EventName { get; set; }
        public JStackItem State { get; set; }

    }
}