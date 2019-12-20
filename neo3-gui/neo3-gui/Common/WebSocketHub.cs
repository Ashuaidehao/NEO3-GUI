using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Akka.Util;
using Neo.Models;

namespace Neo.Common
{
    public class WebSocketHub
    {
        private int _limitCount = 1;
        private readonly ConcurrentDictionary<WebSocketClient, byte> _clients = new ConcurrentDictionary<WebSocketClient, byte>();

        public WebSocketHub()
        {
            //Task.Run(HeartBeatLoop);
        }



        public bool Accept(WebSocketClient client)
        {
            lock (_clients)
            {
                if (_clients.Count >= _limitCount)
                {
                    return false;
                }
                _clients.TryAdd(client, 0);
                return true;
            }
        }

        public bool Remove(WebSocketClient client)
        {
            lock (_clients)
            {
                var success = _clients.TryRemove(client, out var removedClient);
                return success;
            }
        }

        private bool IsHeartBeating = false;

        private async Task HeartBeatLoop()
        {
            IsHeartBeating = true;
            while (IsHeartBeating)
            {
                if (_clients.Any())
                {
                    foreach (var client in _clients.Keys)
                    {
                        client.PushMessage(new WsMessage { Type = WsMessageType.HeartBeat, Result = "heart beat" });
                    }
                }
                await Task.Delay(TimeSpan.FromSeconds(3));
            }
        }


        public void StopHeartBeat()
        {
            IsHeartBeating = false;
        }

        
    }
}
