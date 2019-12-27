using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Network.P2P.Payloads;

namespace Neo.Models.Blocks
{
    public class BlockModel
    {
        public string Hash { get; set; }
        public uint Version { get; set; }
        public string PrevHash { get; set; }
        public string MerkleRoot { get; set; }
        public ulong Timestamp { get; set; }
        public uint Index { get; set; }
        public string NextConsensus { get; set; }
        public Witness Witness { get; set; }

        public ConsensusData ConsensusData { get; set; }
        public Transaction[] Transactions { get; set; }

        //public Header _header { get; set; }
    
        public BlockModel(Block block)
        {
            Version = block.Version;
            PrevHash = block.PrevHash.ToString();
            MerkleRoot = block.MerkleRoot.ToString();
            Timestamp = block.Timestamp;
            Index = block.Index;
            NextConsensus = block.NextConsensus.ToString();
            Hash = block.Hash.ToString();

            Witness = block.Witness;
            Transactions = block.Transactions;
            ConsensusData = block.ConsensusData;
        }
    }
}
