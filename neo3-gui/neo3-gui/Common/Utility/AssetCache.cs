using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using Neo.Common.Storage;
using Neo.Common.Storage.LevelDBModules;
using Neo.Ledger;
using Neo.Models;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;
using Neo.VM.Types;

namespace Neo.Common.Utility
{
    public class AssetCache
    {

        private static readonly ConcurrentDictionary<UInt160, AssetInfo> _assets = new ConcurrentDictionary<UInt160, AssetInfo>();


        /// <summary>
        /// read nep5 from cache first
        /// </summary>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static AssetInfo GetAssetInfo(UInt160 assetId, bool readFromDb = true)
        {
            if (_assets.ContainsKey(assetId))
            {
                return _assets[assetId];
            }
            var snapshot = Helpers.GetDefaultSnapshot();
            return GetAssetInfo(assetId, snapshot, readFromDb);
        }


        /// <summary>
        /// read nep5 from cache first
        /// </summary>
        /// <param name="assetId"></param>
        /// <param name="snapshot"></param>
        /// <returns></returns>
        public static AssetInfo GetAssetInfo(UInt160 assetId, DataCache snapshot, bool readFromDb = true)
        {
            if (_assets.ContainsKey(assetId))
            {
                return _assets[assetId];
            }
            return GetAssetInfoFromChain(assetId, snapshot) ?? (readFromDb ? GetAssetInfoFromDb(assetId) : null);
        }


        /// <summary>
        /// read nep5 from chain, and set cache
        /// https://github.com/neo-project/proposals/blob/master/nep-5.mediawiki
        /// </summary>
        /// <param name="assetId"></param>
        /// <param name="snapshot"></param>
        /// <returns></returns>
        public static AssetInfo GetAssetInfoFromChain(UInt160 assetId, DataCache snapshot)
        {
            using var sb = new ScriptBuilder();
            sb.EmitDynamicCall(assetId, "decimals");
            sb.EmitDynamicCall(assetId, "symbol");
            //sb.EmitAppCall(assetId, "name");
            var contract = snapshot.GetContract(assetId);
            if (contract == null)
            {
                return null;
            }
            try
            {
                using var engine = sb.ToArray().RunTestMode(snapshot);
                //NativeContract.Ledger.
                if (engine.State.HasFlag(VMState.FAULT))
                {
                    Console.WriteLine($"Cannot find Nep5 Asset[{assetId}] at height:{snapshot.GetHeight()}");
                    return null;
                }
                string name = contract.Manifest.Name;
                string symbol = engine.ResultStack.Pop().GetString();
                byte decimals = (byte)engine.ResultStack.Pop().GetInteger();
                symbol = symbol == "neo" || symbol == "gas" ? symbol.ToUpper() : symbol;

                if (string.IsNullOrWhiteSpace(name))
                {
                    return null;
                }
                var assetInfo = new AssetInfo()
                {
                    Asset = assetId,
                    Decimals = decimals,
                    Symbol = symbol,
                    Name = name,
                };
                _assets[assetId] = assetInfo;
                return assetInfo;

            }
            catch (Exception e)
            {
                Console.WriteLine($"Invalid Nep5[{assetId}]:{e}");
                return null;
            }
        }




        /// <summary>
        /// read asset info from backup db
        /// </summary>
        /// <param name="assetId"></param>
        /// <returns></returns>
        public static AssetInfo GetAssetInfoFromDb(UInt160 assetId)
        {
            using var db = new LevelDbContext();
            var oldAsset = db.GetAssetInfo(assetId);
            if (oldAsset != null)
            {
                var asset = new AssetInfo()
                {
                    Asset = assetId,
                    Decimals = oldAsset.Decimals,
                    Name = oldAsset.Name,
                    Symbol = oldAsset.Symbol,
                    //TotalSupply = oldAsset.TotalSupply,
                };
                _assets[assetId] = asset;
                return asset;
            }
            return null;
        }


        public static BigDecimal? GetTotalSupply(UInt160 asset)
        {
            var snapshot = Helpers.GetDefaultSnapshot();
            using var sb = new ScriptBuilder();
            sb.EmitDynamicCall(asset, "totalSupply");
            using var engine = sb.ToArray().RunTestMode(snapshot);
            var total = engine.ResultStack.FirstOrDefault().ToBigInteger();
            var assetInfo = GetAssetInfo(asset);
            return total.HasValue ? new BigDecimal(total.Value, assetInfo.Decimals) : (BigDecimal?)null;
        }

        public static List<BigDecimal?> GetTotalSupply(IEnumerable<UInt160> assets)
        {
            var snapshot = Helpers.GetDefaultSnapshot();
            using var sb = new ScriptBuilder();
            var assetInfos = new List<AssetInfo>();
            foreach (var asset in assets)
            {
                assetInfos.Add(GetAssetInfo(asset));
                sb.EmitDynamicCall(asset, "totalSupply");
            }
            using var engine = sb.ToArray().RunTestMode(snapshot);
            var values = engine.ResultStack.Select(s => s.ToBigInteger()).ToList();
            var results = new List<BigDecimal?>();
            for (var i = 0; i < values.Count; i++)
            {
                results.Add(values[i].HasValue ? new BigDecimal(values[i].Value, assetInfos[i].Decimals) : (BigDecimal?)null);
            }
            return results;
        }
    }
}
