using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Neo.Models;
using Exception = System.Exception;

namespace Neo.Common
{

    public interface IInvoker { }

    public class Invoker : IInvoker
    {
        public AsyncLocal<WebSocketClient> Client;
    }
    public class WebSocketInvoker
    {

        private static Dictionary<string, Func<object, Task<object>>> _methods = new Dictionary<string, Func<object, Task<object>>>(StringComparer.OrdinalIgnoreCase);


        static WebSocketInvoker()
        {
            var invokerType = typeof(IInvoker);
            foreach (var type in invokerType.Assembly.GetExportedTypes().Where(t => !t.IsAbstract && t != invokerType && invokerType.IsAssignableFrom(t)))
            {
                foreach (var methodInfo in type.GetMethods(BindingFlags.Instance | BindingFlags.Public |BindingFlags.DeclaredOnly))
                {
                    try
                    {
                        Console.WriteLine(methodInfo.Name);
                        var paratype = methodInfo.GetParameters()[0].ParameterType;
                        var funcType = typeof(Func<,>).MakeGenericType(paratype,typeof(Task<object>));
                        var func = (Func<object, Task<object>>)Delegate.CreateDelegate(funcType, null, methodInfo);
                        _methods[methodInfo.Name] =func;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                    
                }
            }
        }

        public async Task<object> Invoke(WsRequest request)
        {
            return await _methods[request.Method]?.Invoke(request);
        }




    }
}
