using System.Threading.Tasks;
using Neo.Common;
using Neo.Models;

namespace Neo.Services.ApiServices
{
    public class VerifyApiService : ApiService
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
