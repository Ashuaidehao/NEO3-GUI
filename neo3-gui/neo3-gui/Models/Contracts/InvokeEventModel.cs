using System.Collections.Generic;

namespace Neo.Models.Contracts
{
    public class InvokeEventModel
    {
        public string EventName { get; set; }
        public IEnumerable<JStackItem> Items { get; set; }
    }
}