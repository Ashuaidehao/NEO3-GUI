using System.Threading;

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
    }
}