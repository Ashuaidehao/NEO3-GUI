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
using Neo.IO.Json;

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
            //Converters = { new JObjectConverter() }
        };

        private class JObjectConverter : JsonConverter<JObject>
        {

            public override JObject Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                throw new NotImplementedException();
            }

            public override void Write(Utf8JsonWriter writer, JObject value, JsonSerializerOptions options)
            {
                //writer.WriteStartObject();
                //foreach (KeyValuePair<string, JObject> pair in value.Properties)
                //{
                //    writer.WriteString(pair.Key,pair.Value.ToString());
                //}
                //writer.WriteEndObject();
            }
        }

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
    }
}
