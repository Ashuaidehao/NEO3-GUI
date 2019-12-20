using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Models;

namespace Neo.Common
{
    public class WebSocketContext
    {
        public WebSocketClient Client { get; }
        public WsRequest Request { get; }
    }
}
