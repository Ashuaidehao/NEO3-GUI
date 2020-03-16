﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models
{
    public class AssetInfo
    {
        public UInt160 Asset { get; set; }

        public string Name { get; set; }
        public string Symbol { get; set; }

        public byte Decimals { get; set; }
        public BigInteger TotalSupply { get; set; }
    }
}
