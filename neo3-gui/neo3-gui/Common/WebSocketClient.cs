using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Forms;
using Neo.Invokers;
using Neo.Models;

namespace Neo.Common
{

    public interface IWsClient
    {
        Task PushMessage(object message);
        Task Close();
    }
    public class WebSocketClient
    {
        private readonly WebSocket _socket;

        private readonly BlockingCollection<object> _messagesQueue = new BlockingCollection<object>();



        public WebSocketClient(WebSocket socket)
        {
            _socket = socket;
        }

        /// <summary>
        ///  send message (json format) to client in queue
        /// </summary>
        /// <param name="message"></param>
        public void PushMessage(object message)
        {
            if (message != null)
            {
                _messagesQueue.Add(message);
            }
        }

        /// <summary>
        /// send message queue loop
        /// </summary>
        /// <returns></returns>
        public async Task PushLoop()
        {
            foreach (var msg in _messagesQueue.GetConsumingEnumerable())
            {
                await SendAsync(msg);
            }
        }

        /// <summary>
        /// send message (json format) to client directly
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        private async Task SendAsync(object data)
        {
            await _socket.SendAsync(data);
        }

        /// <summary>
        /// close this connection
        /// </summary>
        /// <param name="closeStatus"></param>
        /// <param name="closeDescription"></param>
        /// <returns></returns>
        public async Task CloseAsync(WebSocketCloseStatus closeStatus, string closeDescription)
        {
            await _socket.CloseAsync(closeStatus, closeDescription, CancellationToken.None);
        }

        public async Task ReceiveLoop()
        {
            var buffer = WebSocket.CreateServerBuffer(4 * 1024);
            var result = await _socket.ReceiveAsync(buffer, CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                try
                {
                    var input = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                    var request = JsonSerializer.Deserialize<WsRequest>(input);
                    InvokeAsync(request);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                result = await _socket.ReceiveAsync(buffer, CancellationToken.None);
            }
            await CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription);
        }





        public async Task InvokeAsync(WsRequest request)
        {
            var result= await new WebSocketInvoker().Invoke(request);
            PushMessage(result);

        } 



 

    }
}
