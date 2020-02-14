using System.Threading;
using Neo.Models;

namespace Neo.Common
{
    public interface IInvoker { }

    public abstract class Invoker : IInvoker
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

        protected WsError Error(string message)
        {
            return Error(-2, message);
        }


        protected WsError Error(int code, string message)
        {
            return new WsError() { Code = code, Message = message };
        }
    }
}