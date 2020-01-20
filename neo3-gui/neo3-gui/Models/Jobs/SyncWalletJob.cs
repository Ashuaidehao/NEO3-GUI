using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.SmartContract.Native;

namespace Neo.Models.Jobs
{
    public class SyncWalletJob : Job
    {
        public SyncWalletJob(TimeSpan timeSpan)
        {
            IntervalTime = timeSpan;
        }
        public override async Task<WsMessage> Invoke()
        {
            if (Program.Service.CurrentWallet != null)
            {
                var accounts = Program.Service.CurrentWallet.GetAccounts().ToList();

                var neoBalances = accounts.Select(a => a.ScriptHash).GetBalanceOf(NativeContract.NEO.Hash);
                var gasBalances = accounts.Select(a => a.ScriptHash).GetBalanceOf(NativeContract.GAS.Hash);



                var model = accounts.Select((a, i) => new
                {
                    address = a.Address,
                    neo = neoBalances[i].ToString(),
                    gas = gasBalances[i].ToString(),
                });

                return new WsMessage()
                {
                    MsgType = WsMessageType.Push,
                    Method = "getWalletBalance",
                    Result = model,
                };

            }

            return null;
        }
    }
}
