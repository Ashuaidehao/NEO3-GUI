using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Models;

namespace Neo.Invokers
{
    public class BlockchainInvoker: Invoker
    {
        public async Task<object> Invoke(WsRequest request)
        {
            var para=(JsonElement)request.Params;
            if (para.ValueKind == JsonValueKind.Array)
            {
                var d = JsonSerializer.Deserialize<object[]>(para.GetRawText());
            }

            if (para.ValueKind == JsonValueKind.Object)
            {
                var d = JsonSerializer.Deserialize<object>(para.GetRawText());
            }
            switch (request.Method)
            {
                case "version":
                    return new { version="1.0"};

                default:
                    return null;
            }
        }


        public async Task<object> Version(WsRequest request)
        {
            return new { version = "2.0" };
        }
    }


}
