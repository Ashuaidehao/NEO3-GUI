using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic;
using Neo.Common;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Wallets;
using Neo.SmartContract;

namespace Neo.Invokers
{
    public class WalletInvoker:Invoker
    {
        private WebSocketSession _session;

        public WalletInvoker(WebSocketSession session)
        {
            _session = session;
        }


        /// <summary>
        /// open wallet
        /// </summary>
        /// <param name="path">wallet path</param>
        /// <param name="password">wallet password</param>
        /// <returns></returns>
        public async Task<WalletModel> OpenWallet(string path,string password)
        {
            try
            {
                Program.Service.OpenWallet(path, password);
            }
            catch (Exception e)
            {
                throw new InvokerException(e.Message);
            }
            var result=new WalletModel();

            using (var snapshot = Blockchain.Singleton.GetSnapshot())
            {
                foreach (var walletAccount in Program.Service.CurrentWallet.GetAccounts())
                {
                    var account=new AccountModel()
                    {
                        Address = walletAccount.Address
                    };

                    if (walletAccount.Contract.Script.IsMultiSigContract(out _, out _))
                    {
                        account.Type = AccountType.MultiSignature;
                    }
                    else if (walletAccount.Contract.Script.IsSignatureContract())
                    {
                        account.Type =  AccountType.Standard;
                    }
                    else if (snapshot.Contracts.TryGet(walletAccount.Contract.ScriptHash) != null)
                    {
                        account.Type = AccountType.DeployedContract;
                    }
                    result.Accounts.Add(account);
                }
            }
            return result;
        }
    }
}
