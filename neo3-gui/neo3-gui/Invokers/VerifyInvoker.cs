using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Models;
using Neo.Wallets;

namespace Neo.Invokers
{
    public class VerifyInvoker : Invoker
    {
        public async Task<object> VerifyPrivateKey(string privateKey)
        {
            if (privateKey.IsNull())
            {
                return Error(ErrorCode.ParameterIsNull);
            }

            var result = privateKey.TryGetPrivateKey();
            if (result.IsNull())
            {
                return Error(ErrorCode.InvalidPrivateKey);
            }
            return result;
        }
    }
}
