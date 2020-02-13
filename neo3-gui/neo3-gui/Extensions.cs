using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.WebSockets;
using System.Numerics;
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
using Neo.IO;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.Tools;
using Neo.VM;
using Neo.VM.Types;
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
            Converters =
            {
                new UInt160Converter(),
                new UInt256Converter(),
                new StringConverter(),
                new BigDecimalConverter(),
            }
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

        /// <summary>
        /// change to utc Time without change time
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static DateTime AsUtcTime(this DateTime time)
        {
            return DateTime.SpecifyKind(time, DateTimeKind.Utc);
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
        /// collection is null or empty
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static bool IsEmpty<T>(this IEnumerable<T> source)
        {
            return source == null || !source.Any();
        }


        /// <summary>
        /// collection is not null or empty
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static bool NotEmpty<T>(this IEnumerable<T> source)
        {
            return !source.IsEmpty();
        }


        /// <summary>
        /// query balance
        /// </summary>
        /// <param name="addresses"></param>
        /// <param name="assetId"></param>
        /// <param name="specificSnapshot"></param>
        /// <returns></returns>
        public static List<BigDecimal> GetBalanceOf(this IEnumerable<UInt160> addresses, UInt160 assetId, StoreView specificSnapshot = null)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                throw new ArgumentException($"invalid assetId:[{assetId}]");
            }
            var executeSnapshot = specificSnapshot;
            if (executeSnapshot == null)
            {
                using var snapshot = Blockchain.Singleton.GetSnapshot();
                executeSnapshot = snapshot;
            }
            using var sb = new ScriptBuilder();
            foreach (var address in addresses)
            {
                sb.EmitAppCall(assetId, "balanceOf", address);
            }
            using ApplicationEngine engine = ApplicationEngine.Run(sb.ToArray(), executeSnapshot, testMode: true);
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
        /// <param name="specificSnapshot"></param>
        /// <returns></returns>
        public static BigDecimal GetBalanceOf(this UInt160 address, UInt160 assetId, StoreView specificSnapshot = null)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                return new BigDecimal(0, 0);
            }
            var executeSnapshot = specificSnapshot;
            if (executeSnapshot == null)
            {
                using var snapshot = Blockchain.Singleton.GetSnapshot();
                executeSnapshot = snapshot;
            }
            using var sb = new ScriptBuilder();
            sb.EmitAppCall(assetId, "balanceOf", address);
            using var engine = ApplicationEngine.Run(sb.ToArray(), executeSnapshot, testMode: true);
            if (engine.State.HasFlag(VMState.FAULT))
            {
                return new BigDecimal(0, 0);
            }
            var balances = engine.ResultStack.Pop().GetBigInteger();
            return new BigDecimal(balances, assetInfo.Decimals);
        }


        /// <summary>
        /// sum same asset amount
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static BigDecimal SumAssetAmount(this IEnumerable<BigDecimal> source)
        {
            if (source == null)
            {
                throw new ArgumentNullException();
            }
            var item = source.FirstOrDefault();
            var total = source.Select(s => s.Value).Sum();
            return new BigDecimal(total, item.Decimals);
        }


        /// <summary>
        /// convert bigint to asset decimal value
        /// </summary>
        /// <param name="amount"></param>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static (BigDecimal amount, AssetInfo asset) GetAssetAmount(this BigInteger amount, UInt160 assetId)
        {
            var asset = AssetCache.GetAssetInfo(assetId);
            if (asset == null)
            {
                return (new BigDecimal(0, 0), null);
            }
            return (new BigDecimal(amount, asset.Decimals), asset);
        }

        /// <summary>
        /// convert to hex string without "Ox"
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public static string ToHexString(this UIntBase address)
        {
            return address.ToArray().ToHexString(reverse: true);
        }

        private static readonly DateTime unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="timestamp"></param>
        /// <returns></returns>
        public static DateTime FromTimestampMS(this ulong timestamp)
        {
            return unixEpoch.AddMilliseconds(timestamp);
        }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
            return Expression.Lambda<Func<T, bool>>
                (Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            if (expr1 == null)
            {
                return expr2;
            }
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
            return Expression.Lambda<Func<T, bool>>
                (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
        }


        private static readonly Dictionary<ErrorCode, string> _errorMap = new Dictionary<ErrorCode, string>()
        {
            [ErrorCode.MethodNotFound] = "method not found.",
            [ErrorCode.WalletNotOpen] = "please open wallet first.",
        };

        public static WsError ToError(this ErrorCode code)
        {
            return new WsError()
            {
                Code = (int)code,
                Message = _errorMap.ContainsKey(code) ? _errorMap[code] : "error...",
            };
        }

        public static bool NotVmByteArray(this StackItem item)
        {
            return !(item is ByteArray);
        }

        public static bool NotVmNull(this StackItem item)
        {
            return !(item is Null);
        }


        public static bool NotVmInt(this StackItem item)
        {
            return !(item is Integer);
        }
    }
}
