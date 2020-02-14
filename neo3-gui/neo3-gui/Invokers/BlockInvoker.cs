using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Ledger;
using Neo.Models.Blocks;
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
    }
}
