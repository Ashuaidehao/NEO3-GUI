using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo.Ledger;

namespace Neo.Models.Contracts
{
    public class ContractModel
    {
        public ContractModel(ContractState contract)
        {
            Id = contract.Id;
            ContractHash = contract.ScriptHash;
            HasStorage = contract.HasStorage;
            Payable = contract.Payable;
            Script = contract.Script;
        }

        public int Id { get; set; }
        public UInt160 ContractHash { get; set; }
        public bool HasStorage { get; set; }
        public bool Payable { get; set; }
        public byte[] Script { get; set; }
    }
}
