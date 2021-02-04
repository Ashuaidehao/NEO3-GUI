using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Ledger;
using Neo.Network.P2P;
using Neo.SmartContract.Native;

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
            uint height = Blockchain.Singleton.GetHeight();
            return new WsMessage()
            {
                MsgType = WsMessageType.Push,
                Method = "getSyncHeight",
                Result = new HeightStateModel { 
                    SyncHeight = height,
                    HeaderHeight  = Blockchain.Singleton.HeaderCache.Last?.Index ?? height,
                    ConnectedCount = LocalNode.Singleton.ConnectedCount }
            };
        }
    }
}
