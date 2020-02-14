using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Storage
{
    public class AssetBalanceInfo
    {
        public UInt160 Address { get; set; }
        public UInt160 Asset { get; set; }
        public BigInteger Balance { get; set; }

        public uint BlockHeight { get; set; }
    }
}
