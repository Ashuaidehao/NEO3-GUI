using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models.Wallets
{
    public class WalletModel
    {
        public List<AccountModel> Accounts { get; set; }=new List<AccountModel>();
    }

    public class AccountModel
    {
        public string Address { get; set; }
        public AccountType Type { get; set; }
    }

    public enum AccountType
    {
        NonStandard,
        Standard,
        MultiSignature,
        DeployedContract,
    }
}
