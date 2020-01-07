using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Ledger;
using Neo.Models;
using Neo.SmartContract;
using Neo.VM;

namespace Neo.Tools
{
    public class AssetCache
    {

        private static readonly Dictionary<UInt160, AssetInfo> _assets = new Dictionary<UInt160, AssetInfo>();




        /// <summary>
        /// https://github.com/neo-project/proposals/blob/master/nep-5.mediawiki
        /// </summary>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static AssetInfo GetAssetInfo(UInt160 assetId)
        {
            if (_assets.ContainsKey(assetId))
            {
                return _assets[assetId];
            }

            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();
            sb.EmitAppCall(assetId, "decimals");
            sb.EmitAppCall(assetId, "symbol");
            sb.EmitAppCall(assetId, "name");

            using var engine = ApplicationEngine.Run(sb.ToArray(), snapshot, testMode: true);
            var name = engine.ResultStack.Pop().GetString();
            var symbol = engine.ResultStack.Pop().GetString();
            var decimals = (byte)engine.ResultStack.Pop().GetBigInteger();

            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }
            var assetInfo = new AssetInfo()
            {
                AssetId = assetId,
                Decimals = decimals,
                Symbol = symbol,
                Name = name,
            };
            _assets[assetId] = assetInfo;
            return assetInfo;

        }
    }
}
