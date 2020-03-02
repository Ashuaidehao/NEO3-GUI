using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Akka.Actor;
using Microsoft.Extensions.Configuration;
using Neo.CLI;
using Neo.Common;
using Neo.Ledger;
using Neo.Network.P2P.Payloads;
using Neo.Tools;

namespace Neo
{
    public class GuiService : MainService
    {

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);
            UnconfirmedTransactionCache.RegisterBlockPersistEvent();
        }


        public Nep5Tracker Nep5Tracker = new Nep5Tracker();

        /// <summary>
        /// close wallet
        /// </summary>
        public void CloseWallet()
        {
            base.OnCommand(new[] { "close", "wallet" });
        }
    }
}
