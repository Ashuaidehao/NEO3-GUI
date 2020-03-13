using Neo.Network.P2P.Payloads;
using Neo.Wallets;

namespace Neo.Models.Transactions
{
    public class WitnessModel
    {
        public WitnessModel(Witness witness)
        {
            if (witness != null)
            {
                InvocationScript = witness.InvocationScript;
                VerificationScript = witness.VerificationScript;
                ScriptHash = witness.ScriptHash;
            }
        }
        public byte[] InvocationScript { get; set; }
        public byte[] VerificationScript { get; set; }

        public UInt160 ScriptHash { get; set; }

        public string Address => ScriptHash?.ToAddress();
    }
}