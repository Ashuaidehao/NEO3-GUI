using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Ledger;
using Neo.Models.Blocks;
using Neo.Storage;
using Neo.Tools;

namespace Neo.Invokers
{
    public class BlockInvoker:Invoker
    {
        public async Task<object> GetBlock(uint index)
        {
            var block= Blockchain.Singleton.GetBlock(index);
            if (block != null)
            {
                return new BlockModel(block);
            }

            return $"Block[{index}] not found!";
        }


        public async Task<object> GetAllAssets()
        {
            return AssetCache.GetAllAssets();
        }

        public async Task<object> GetAddressBalance(UInt160 address,UInt160 asset=null)
        {
            using var db=new TrackDB();
            return db.FindAssetBalance(address, asset);
        }
    }
}
