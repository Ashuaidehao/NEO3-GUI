using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Blocks;
using Neo.Network.P2P.Payloads;
using Neo.Storage;
using Neo.Tools;

namespace Neo.Invokers
{
    public class BlockInvoker : Invoker
    {
        /// <summary>
        /// get block by height
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public async Task<object> GetBlock(uint index)
        {
            var block = Blockchain.Singleton.GetBlock(index);
            if (block == null)
            {
                return Error(ErrorCode.BlockHeightInvalid);
            }
            return ToBlockModel(block);
        }

        /// <summary>
        /// get block by hash
        /// </summary>
        /// <param name="hash"></param>
        /// <returns></returns>
        public async Task<object> GetBlockByHash(UInt256 hash)
        {
            var block = Blockchain.Singleton.GetBlock(hash);
            if (block == null)
            {
                return Error(ErrorCode.BlockHashInvalid);
            }

            return ToBlockModel(block);
        }

 

        /// <summary>
        /// get latest blocks info
        /// </summary>
        /// <param name="limit"></param>
        /// <returns></returns>
        public async Task<object> GetLastBlocks(int limit = 10, int? height = null)
        {
            var lastHeight = Blockchain.Singleton.Height;
            if (height > lastHeight)
            {
                return Error(ErrorCode.BlockHeightInvalid);
            }

            height ??= (int)lastHeight;
            var blocks = await GetBlockByRange((height.Value - limit + 1), (int)height);

            var result = blocks.Select(b => new BlockPreviewModel(b));
            return result;
        }




        public async Task<object> GetAllAssets()
        {
            return AssetCache.GetAllAssets();
        }

        public async Task<object> GetAddressBalance(UInt160 address, UInt160 asset = null)
        {
            using var db = new TrackDB();
            return db.FindAssetBalance(address, asset);
        }


        #region Private

        private BlockModel ToBlockModel(Block block)
        {
            var model = new BlockModel(block);
            model.Confirmations = Blockchain.Singleton.Height - block.Index + 1;

            if (block.Transactions.NotEmpty())
            {
                using var db = new TrackDB();
                var trans = db.FindTransfer(new TrackFilter() { TxIds = block.Transactions.Select(t => t.Hash).ToList() });
                model.Transactions = trans.List.ToTransactionPreviewModel();
            }

            return model;
        }

        private Block GetBlockByHeight(uint height)
        {
            var block = Blockchain.Singleton.GetBlock(height);
            return block;
        }

        private async Task<IEnumerable<Block>> GetBlockByRange(int low, int high)
        {
            low = low < 0 ? 0 : low;
            high = high > Blockchain.Singleton.Height ? (int)Blockchain.Singleton.Height : high;

            var tasks = Enumerable.Range(low, high - low + 1).Reverse().Select(async (i) => GetBlockByHeight((uint)i));
            await Task.WhenAll(tasks);
            return tasks.Select(t => t.Result);
        }
        #endregion
    }
}
