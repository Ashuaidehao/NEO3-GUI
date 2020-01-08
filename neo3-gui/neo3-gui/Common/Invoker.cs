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


        protected ErrorResult Error(string message)
        {
            return new ErrorResult(message);
        }
    }
}