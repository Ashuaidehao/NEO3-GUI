using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models.Transactions
{
    public class TransferModel
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Amount { get; set; }
        public string Symbol { get; set; }
    }
}
