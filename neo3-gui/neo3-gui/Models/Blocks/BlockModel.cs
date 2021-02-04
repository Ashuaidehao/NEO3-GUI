using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Neo.Models.Transactions;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract.Native;
using Neo.Wallets;

namespace Neo.Models.Blocks
{
    public class BlockModel
    {

        public BlockModel(Block block)
        {
            BlockHash = block.Hash;
            BlockHeight = block.Index;
            Timestamp = block.Timestamp;
            Size = block.Size;
            Version = block.Version;
            PrevHash = block.PrevHash;
            MerkleRoot = block.MerkleRoot;
            NextConsensusHash = block.NextConsensus;
            Witness = new WitnessModel(block.Witness);
            ConsensusData = new ConsensusDataModel(block.ConsensusData);
            if (block.Transactions.NotEmpty())
            {
                SystemFee = new BigDecimal((BigInteger)block.Transactions.Sum(t => t.SystemFee), NativeContract.GAS.Decimals).ToString();
                NetworkFee = new BigDecimal((BigInteger)block.Transactions.Sum(t => t.NetworkFee), NativeContract.GAS.Decimals).ToString();
            }
        }

        public UInt256 BlockHash { get; set; }
        public uint BlockHeight { get; set; }
        public DateTime BlockTime => Timestamp.FromTimestampMS().ToLocalTime();
        public ulong Timestamp { get; set; }

        public int Size { get; set; }


        public uint Version { get; set; }
        public UInt256 PrevHash { get; set; }
        public UInt256 MerkleRoot { get; set; }
        public UInt160 NextConsensusHash { get; set; }
        public string NextConsensus => NextConsensusHash?.ToAddress();

        public uint Confirmations { get; set; }
        //public long Nonce { get; set; }
        public string SystemFee { get; set; }
        public string NetworkFee { get; set; }
        public WitnessModel Witness { get; set; }
        public ConsensusDataModel ConsensusData { get; set; }
        //public List<TransactionPreviewModel> Transactions { get; set; }

    }
}
