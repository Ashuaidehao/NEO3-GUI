using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Network.P2P.Payloads;

namespace Neo.Models.Blocks
{
    public class ConsensusDataModel
    {
        public ConsensusDataModel(ConsensusData consensus)
        {
            if (consensus != null)
            {
                Hash = consensus.Hash;
                PrimaryIndex = consensus.PrimaryIndex;
                Nonce = consensus.Nonce;
            }
        }

        public uint PrimaryIndex { get; set; }
        public ulong Nonce { get; set; }

        private UInt256 Hash { get; set; }
    }
}
