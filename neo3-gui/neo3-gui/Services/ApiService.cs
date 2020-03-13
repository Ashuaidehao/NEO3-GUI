using System.Threading;
using Neo.Common;
using Neo.Models;

namespace Neo.Services
{
    public interface IApiService { }
    public abstract class ApiService : IApiService
    {
        private readonly AsyncLocal<IWebSocketConnection> _asyncClient = new AsyncLocal<IWebSocketConnection>();

        public IWebSocketConnection Client
        {
            get => _asyncClient.Value;
            set => _asyncClient.Value = value;
        }


        protected WsError Error(ErrorCode code)
        {
            return code.ToError();
        }
        protected WsError Error(ErrorCode code, string message)
        {
            return new WsError() { Code = (int)code, Message = message };
        }

        protected WsError Error(int code, string message)
        {
            return new WsError() { Code = code, Message = message };
        }
    }
}