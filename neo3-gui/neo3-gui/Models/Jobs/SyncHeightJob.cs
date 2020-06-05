using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Ledger;
using Neo.Network.P2P;

namespace Neo.Models.Jobs
{
    public class SyncHeightJob:Job
    {
        public SyncHeightJob(TimeSpan timeSpan)
        {
            IntervalTime = timeSpan;
        }
        public override async Task<WsMessage> Invoke()
        {
            return new WsMessage()
            {
                MsgType = WsMessageType.Push,
                Method = "getSyncHeight",
                Result = new HeightStateModel { SyncHeight = Blockchain.Singleton.Height, HeaderHeight = Blockchain.Singleton.HeaderHeight,ConnectedCount = LocalNode.Singleton.ConnectedCount }
            };
        }
    }
}
