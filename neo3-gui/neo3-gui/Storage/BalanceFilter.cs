using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Storage
{
    public class BalanceFilter
    {
        public IEnumerable<UInt160> Addresses { get; set; }
        public IEnumerable<UInt160> Assets { get; set; }
    }
}
