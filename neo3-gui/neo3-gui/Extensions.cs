using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Neo.Common;
using Neo.Common.Json;
using Neo.IO.Json;
using Neo.Wallets;

namespace Neo
{
    public static class Extensions
    {

        public static readonly JsonSerializerOptions SerializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreNullValues = true,
            PropertyNameCaseInsensitive = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            Converters = { new UInt160Converter(), new UInt256Converter() }
        };



        /// <summary>
        /// 
        /// </summary>
        /// <param name="socket"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public static async Task SendAsync(this WebSocket socket, object data)
        {
            if (data == null)
            {
                return;
            }
            var bytes = SerializeJsonBytes(data);
            await socket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }


        /// <summary>
        /// serialize to utf8 json bytes, more performance than to json string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static byte[] SerializeJsonBytes<T>(this T obj)
        {
            return JsonSerializer.SerializeToUtf8Bytes(obj, SerializeOptions);
        }

        /// <summary>
        /// serialize to utf8 json string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string SerializeJson<T>(this T obj)
        {
            return JsonSerializer.Serialize(obj, SerializeOptions);
        }



        /// <summary>
        /// deserialize from json string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static T DeserializeJson<T>(this string json)
        {
            return JsonSerializer.Deserialize<T>(json, SerializeOptions);
        }



        /// <summary>
        /// deserialize from json string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <param name="targetType"></param>
        /// <returns></returns>
        public static object DeserializeJson(this string json, Type targetType)
        {
            return JsonSerializer.Deserialize(json, targetType, SerializeOptions);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        public static void AddWebSocketInvoker(this IServiceCollection services)
        {
            services.AddSingleton<WebSocketHub>();
            services.AddSingleton<WebSocketHubMiddleware>();
            services.AddSingleton<WebSocketSession>();
            services.AddSingleton<WebSocketExecutor>();
            var interfaceType = typeof(IInvoker);
            var assembly = interfaceType.Assembly;
            foreach (var type in assembly.GetExportedTypes().Where(t => !t.IsAbstract && interfaceType.IsAssignableFrom(t)))
            {
                services.AddSingleton(type);
            }
        }



        private static readonly Dictionary<Type, object> defaultValues = new Dictionary<Type, object>();

        /// <summary>
        /// get input type default value
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object GetDefaultValue(this Type type)
        {
            if (defaultValues.ContainsKey(type))
            {
                return defaultValues[type];
            }
            if (type.IsValueType)
            {
                var val = Activator.CreateInstance(type);
                defaultValues[type] = val;
                return val;
            }
            return null;
        }



        /// <summary>
        /// convert private key string(wif or hex) to bytes
        /// </summary>
        /// <param name="privateKey"></param>
        /// <returns></returns>
        public static byte[] ToPrivateKeyBytes(this string privateKey)
        {
            byte[] keyBytes;
            try
            {
                keyBytes = Wallet.GetPrivateKeyFromWIF(privateKey);
            }
            catch
            {
                keyBytes = privateKey.HexToBytes();
            }
            return keyBytes;
        }
    }
}
