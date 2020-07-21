using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Neo.Cryptography.ECC;
using Neo.IO.Json;
using Neo.SmartContract;

namespace Neo.Models
{
    public class JStackItem
    {
        public ContractParameterType TypeCode { get; set; }
        public string Type { get; set; }
        public object Value { get; set; }

        public string ValueString => Value is byte[] v ? Encoding.UTF8.GetString(v) : null;
        public string ValueAddress => Value is byte[] v ? v.TryToAddress() : null;

        public static JStackItem FromJson(JObject json)
        {
            JStackItem parameter = new JStackItem
            {
                TypeCode = json["type"].TryGetEnum<ContractParameterType>(),
                Type = json["type"].AsString(),
            };
            if (parameter.Type == "ByteString")
            {
                parameter.TypeCode = ContractParameterType.ByteArray;
            }
            if (json["value"] != null)
                switch (parameter.TypeCode)
                {
                    case ContractParameterType.Signature:
                    case ContractParameterType.ByteArray:
                        parameter.Value = Convert.FromBase64String(json["value"].AsString());
                        break;
                    case ContractParameterType.Boolean:
                        parameter.Value = json["value"].AsBoolean();
                        break;
                    case ContractParameterType.Integer:
                        parameter.Value = BigInteger.Parse(json["value"].AsString());
                        break;
                    case ContractParameterType.Hash160:
                        parameter.Value = UInt160.Parse(json["value"].AsString());
                        break;
                    case ContractParameterType.Hash256:
                        parameter.Value = UInt256.Parse(json["value"].AsString());
                        break;
                    case ContractParameterType.PublicKey:
                        parameter.Value = ECPoint.Parse(json["value"].AsString(), ECCurve.Secp256r1);
                        break;
                    case ContractParameterType.String:
                        parameter.Value = json["value"].AsString();
                        break;
                    case ContractParameterType.Array:
                        parameter.Value = ((JArray)json["value"]).Select(p => FromJson(p)).ToList();
                        break;
                    case ContractParameterType.Map:
                        parameter.Value = ((JArray)json["value"]).Select(p => new KeyValuePair<JStackItem, JStackItem>(FromJson(p["key"]), FromJson(p["value"]))).ToList();
                        break;
                    default:
                        throw new ArgumentException();
                }
            return parameter;
        }
    }
}
