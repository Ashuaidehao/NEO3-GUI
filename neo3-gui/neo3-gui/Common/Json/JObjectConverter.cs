using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Neo.IO.Json;

namespace Neo.Common.Json
{
    public class JObjectConverter : JsonConverter<JObject>
    {
        public override JObject Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using JsonDocument document = JsonDocument.ParseValue(ref reader);
            var text= document.RootElement.Clone().ToString();
            return JObject.Parse(text);
        }

        public override void Write(Utf8JsonWriter writer, JObject value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case JArray array:
                    writer.WriteStartArray();
                    foreach (JObject item in array)
                    {
                        Write(writer, item, options);
                    }
                    writer.WriteEndArray();
                    break;
                case JNumber num:
                    writer.WriteNumberValue(num.Value);
                    break;
                case JString str:
                    writer.WriteStringValue(str.Value);
                    break;
                case JBoolean boolean:
                    writer.WriteBooleanValue(boolean.Value);
                    break;
                case JObject obj:
                    writer.WriteStartObject();
                    foreach (KeyValuePair<string, JObject> pair in value.Properties)
                    {
                        writer.WritePropertyName(pair.Key);
                        if (pair.Value is null)
                            writer.WriteNullValue();
                        else
                            Write(writer, pair.Value,options);
                    }
                    writer.WriteEndObject();
                    break;
              
            }
        }
    }
}
