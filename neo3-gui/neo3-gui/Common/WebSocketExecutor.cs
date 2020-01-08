using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Neo.Models;
using Microsoft.Extensions.DependencyInjection;


namespace Neo.Common
{


    public class WebSocketExecutor
    {

        private readonly Dictionary<string, MethodMetadata> _methods = new Dictionary<string, MethodMetadata>(StringComparer.OrdinalIgnoreCase);

        private readonly IServiceProvider _provider;


        public WebSocketExecutor(IServiceProvider provider)
        {
            _provider = provider;
            var invokerType = typeof(IInvoker);
            foreach (var type in invokerType.Assembly.GetExportedTypes().Where(t => !t.IsAbstract && t != invokerType && invokerType.IsAssignableFrom(t)))
            {
                foreach (var methodInfo in type.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly))
                {
                    try
                    {
                        var methodMetadata = new MethodMetadata(methodInfo);
                        if (methodMetadata.IsValid)
                        {
                            _methods[methodInfo.Name] = methodMetadata;
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                }
            }
        }

        public async Task<object> Excute(WsRequest request)
        {
            if (_methods.TryGetValue(request.Method, out var method))
            {
                var instance = _provider.GetService(method.DeclaringType);
                if (instance is Invoker invoker)
                {
                    invoker.Client = _provider.GetService<WebSocketSession>().Connection;
                }
                return await method.Invoke(instance, request);

            }
            return new ErrorResult($"method [{request.Method}] not found!");
        }




    }
}
