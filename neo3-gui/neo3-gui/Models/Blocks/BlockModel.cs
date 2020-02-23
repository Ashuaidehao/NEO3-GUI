using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Neo.Models.Transactions;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract.Native;

namespace Neo.Models.Blocks
{
    public class BlockModel
    {

        public BlockModel(Block block)
        {
            Hash = block.Hash;
            BlockHeight = block.Index;
            Timestamp = block.Timestamp;
            Size = block.Size;
            Version = block.Version;
            PrevHash = block.PrevHash;
            MerkleRoot = block.MerkleRoot;
            NextConsensus = block.NextConsensus;
            Witness = new WitnessModel(block.Witness);
            //Transactions = block.Transactions;
            ConsensusData = new ConsensusDataModel(block.ConsensusData);
            if (block.Transactions.NotEmpty())
            {
                SystemFee = block.Transactions.Sum(t =>t.SystemFee).ToString();
                NetworkFee= block.Transactions.Sum(t => t.NetworkFee).ToString();
            }
            //block.Transactions[1]
        }

        public UInt256 Hash { get; set; }
        public uint BlockHeight { get; set; }
        public DateTime BlockTime => Timestamp.FromTimestampMS().ToLocalTime();
        public ulong Timestamp { get; set; }

        public int Size { get; set; }


        public uint Version { get; set; }
        public UInt256 PrevHash { get; set; }
        public UInt256 MerkleRoot { get; set; }
        public UInt160 NextConsensus { get; set; }

        public uint Confirmations { get; set; }
        //public long Nonce { get; set; }
        public string SystemFee { get; set; }
        public string NetworkFee { get; set; }
        public WitnessModel Witness { get; set; }
        public ConsensusDataModel ConsensusData { get; set; }
        public List<TransactionPreviewModel> Transactions { get; set; }

    }
}
