using Neo.SmartContract.Manifest;

namespace Neo.Models.Contracts
{
    public class ManifestModel
    {

        public ManifestModel(ContractManifest manifest)
        {
            if (manifest != null)
            {
                ContractHash = manifest.Hash;
                Groups = manifest.Groups;
                Permissions = manifest.Permissions;
                Trusts = manifest.Trusts;
                SafeMethods = manifest.SafeMethods;
                Features = manifest.Features;
                Abi = new ContractAbiModel(manifest.Abi);
                Extra = manifest.Extra;
            }
        }
        /// <summary>
        /// Contract hash
        /// </summary>
        public UInt160 ContractHash { get; set; }
        /// <summary>
        /// A group represents a set of mutually trusted contracts. A contract will trust and allow any contract in the same group to invoke it, and the user interface will not give any warnings.
        /// </summary>
        public ContractGroup[] Groups { get; set; }



        /// <summary>
        /// The features field describes what features are available for the contract.
        /// </summary>
        public ContractFeatures Features { get; set; }

        /// <summary>
        /// For technical details of ABI, please refer to NEP-3: NeoContract ABI. (https://github.com/neo-project/proposals/blob/master/nep-3.mediawiki)
        /// </summary>
        public ContractAbiModel Abi { get; set; }

        /// <summary>
        /// The permissions field is an array containing a set of Permission objects. It describes which contracts may be invoked and which methods are called.
        /// </summary>
        public ContractPermission[] Permissions { get; set; }

        /// <summary>
        /// The trusts field is an array containing a set of contract hashes or group public keys. It can also be assigned with a wildcard *. If it is a wildcard *, then it means that it trusts any contract.
        /// If a contract is trusted, the user interface will not give any warnings when called by the contract.
        /// </summary>
        public WildcardContainer<UInt160> Trusts { get; set; }

        /// <summary>
        /// The safemethods field is an array containing a set of method names. It can also be assigned with a wildcard *. If it is a wildcard *, then it means that all methods of the contract are safe.
        /// If a method is marked as safe, the user interface will not give any warnings when it is called by any other contract.
        /// </summary>
        public WildcardContainer<string> SafeMethods { get; set; }


        /// <summary>
        /// Custom user data
        /// </summary>
        public object Extra { get; set; }

    }
}