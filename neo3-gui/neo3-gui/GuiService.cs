using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Akka.Actor;
using Microsoft.Extensions.Configuration;
using Neo.CLI;
using Neo.Ledger;
using Neo.Network.P2P.Payloads;

namespace Neo
{
    public class GuiService:MainService
    {
        public async Task StartGui(string[] args)
        {
            Start(args);
        }
    }
}
