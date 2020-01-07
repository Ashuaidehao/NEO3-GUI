using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Neo.Common.Json
{
    public class UInt160Converter : JsonConverter<UInt160>
    {
        public override UInt160 Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var data = reader.GetString();
            return UInt160.Parse(data);
        }

        public override void Write(Utf8JsonWriter writer, UInt160 value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }
}
