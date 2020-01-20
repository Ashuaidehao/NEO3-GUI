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
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.DependencyInjection;
using Neo.Common;
using Neo.Common.Json;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.Tools;
using Neo.VM;
using Neo.Wallets;
using JsonSerializer = System.Text.Json.JsonSerializer;

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
            Converters = { new UInt160Converter(), new UInt256Converter(),new StringConverter() }
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
            if (json.IsNull())
            {
                return default(T);
            }
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


        /// <summary>
        /// string is null or white space
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static bool IsNull(this string text)
        {
            return string.IsNullOrWhiteSpace(text);
        }


        /// <summary>
        /// string is not null or white space
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static bool NotNull(this string text)
        {
            return !IsNull(text);
        }


        /// <summary>
        /// query balance
        /// </summary>
        /// <param name="addresses"></param>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static List<BigDecimal> GetBalanceOf(this IEnumerable<UInt160> addresses, UInt160 assetId)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                throw new ArgumentException($"invalid assetId:[{assetId}]");
            }
            using SnapshotView snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();
            foreach (var address in addresses)
            {
                sb.EmitAppCall(assetId, "balanceOf", address);
            }
            using ApplicationEngine engine = ApplicationEngine.Run(sb.ToArray(), snapshot, testMode: true);
            if (engine.State.HasFlag(VMState.FAULT))
            {
                throw new Exception($"query balance error");
            }
            var result = engine.ResultStack.Select(p => p.GetBigInteger());
            return result.Select(bigInt => new BigDecimal(bigInt, assetInfo.Decimals)).ToList();
        }



        /// <summary>
        /// query balance
        /// </summary>
        /// <param name="address"></param>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static BigDecimal GetBalanceOf(this UInt160 address, UInt160 assetId)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                return new BigDecimal(0, 0);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();

            sb.EmitAppCall(assetId, "balanceOf", address);

            using var engine = ApplicationEngine.Run(sb.ToArray(), snapshot, testMode: true);
            if (engine.State.HasFlag(VMState.FAULT))
            {
                return new BigDecimal(0, 0);
            }
            var balances = engine.ResultStack.Pop().GetBigInteger();
            return new BigDecimal(balances, assetInfo.Decimals);
        }
    }
}
