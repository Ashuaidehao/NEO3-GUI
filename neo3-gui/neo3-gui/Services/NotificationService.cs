using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Neo.Common;
using Neo.Ledger;
using Neo.Models;

namespace Neo.Services
{
    public class NotificationService
    {
        private readonly WebSocketHub _hub;

        private bool _running = true;
        public NotificationService(WebSocketHub hub)
        {
            _hub = hub;
        }

        public async Task Start()
        {
            while (_running)
            {
                _hub.PushAll(new WsMessage()
                {
                    MsgType = WsMessageType.Push,
                    Method = "getSyncHeight",
                    Result = new HeightStateModel { SyncHeight = Blockchain.Singleton.Height, HeaderHeight = Blockchain.Singleton.HeaderHeight }
                });
                await Task.Delay(TimeSpan.FromSeconds(1000));
            }
        }

        public void Stop()
        {
            _running = false;
        }
    }

    public static class NotificationServiceExtension
    {
        public static void UseNotificationService(this IApplicationBuilder app)
        {
            var service = app.ApplicationServices.GetService<NotificationService>();
            Task.Run(service.Start);
        }
    }
}
