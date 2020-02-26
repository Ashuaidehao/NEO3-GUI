using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Storage;
using Neo.Wallets;

namespace Neo.Models.Wallets
{
    public class AddressBalanceModel
    {
        public AddressBalanceModel(BalanceInfo balance)
        {
            AddressHash = balance.Address;
            Address = balance.Address.ToAddress();
            Asset = balance.Asset;
            Symbol = balance.AssetSymbol;
            Balance = new BigDecimal(balance.Balance, balance.AssetDecimals);
        }

        public UInt160 AddressHash { get; set; }
        public string Address { get; set; }
        public UInt160 Asset { get; set; }
        public string Symbol { get; set; }
        public BigDecimal Balance { get; set; }
    }
}
