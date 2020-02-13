using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models.Wallets
{
    public class WalletBalanceModel
    {
        public UInt160 Asset { get; set; }
        public BigDecimal Balance { get; set; }
    }
}
