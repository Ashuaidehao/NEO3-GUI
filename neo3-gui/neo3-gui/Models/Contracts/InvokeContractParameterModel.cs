using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.IO.Json;

namespace Neo.Models.Contracts
{
    public class InvokeContractParameterModel
    {
        public UInt160 ContractHash { get; set; }
        public string Method { get; set; }

        public List<JObject> Parameters { get; set; }
        public List<CosignerModel> Cosigners { get; set; }

        public bool SendTx { get; set; }
    }
}
