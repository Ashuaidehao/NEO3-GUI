using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Neo.Cryptography.ECC;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.VM;

namespace Neo.Services.ApiServices
{
    public class GovernanceService : ApiService
    {

        public async Task<List<string>> GetCommittees()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var points = NativeContract.NEO.GetCommittee(snapshot);
            return points.Select(p => p.ToVerificationContract().Address).ToList();
        }


        public async Task<bool> IsCommittee()
        {
            if (CurrentWallet == null)
            {
                return false;
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var points = NativeContract.NEO.GetCommittee(snapshot);
            var committees = points.Select(p => p.ToVerificationContract().Address).ToList();
            return CurrentWallet.GetAccounts().Any(a => committees.Contains(a.Address));
        }


        #region DesignRole

        /// <summary>
        /// vote for consensus node
        /// </summary>
        /// <returns></returns>
        public async Task<object> DesignRole(Role role, string[] pubkeys, List<UInt160> signers = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            ECPoint[] publicKeys = null;
            try
            {
                publicKeys = pubkeys.Select(p => ECPoint.Parse(p, ECCurve.Secp256r1)).ToArray();
            }
            catch (Exception e)
            {
                return Error(ErrorCode.InvalidPara);
            }

            if (publicKeys.IsEmpty())
            {
                return Error(ErrorCode.InvalidPara);
            }


            var paras = new List<ContractParameter>();
            paras.Add(new ContractParameter(ContractParameterType.Integer) { Value = (int)role });
            paras.Add(new ContractParameter(ContractParameterType.Array)
            {
                Value = publicKeys.Select(p => new ContractParameter(ContractParameterType.PublicKey) { Value = p }).ToList()
            });
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.RoleManagement.Hash, "designateAsRole", paras.ToArray());

            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);

            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }


        /// <summary>
        /// query Designated Nodes by Role
        /// </summary>
        /// <param name="role"></param>
        /// <param name="height"></param>
        /// <returns></returns>
        public async Task<object> GetNodesByRole(Role role, uint? height = null)
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var points = NativeContract.RoleManagement.GetDesignatedByRole(snapshot, role, height ?? snapshot.GetHeight());
            return points?.Select(p => p.ToString()).ToList();
        }

        #endregion


        #region Policy

        public async Task<uint> GetMaxTransactionsPerBlock()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            return NativeContract.Policy.GetMaxTransactionsPerBlock(snapshot);
        }



        public async Task<object> SetMaxTransactionsPerBlock(uint max, List<UInt160> signers = null)
        {
            if (max > Block.MaxTransactionsPerBlock)
            {
                return Error(ErrorCode.InvalidPara, $"input value is bigger than {Block.MaxTransactionsPerBlock}");
            }
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();

            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "setMaxTransactionsPerBlock", new ContractParameter
            {
                Type = ContractParameterType.Integer,
                Value = max
            });

            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }


        public async Task<uint> GetMaxBlockSize()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            return NativeContract.Policy.GetMaxBlockSize(snapshot);
        }


        public async Task<object> SetMaxBlockSize(uint max, List<UInt160> signers = null)
        {
            if (max > Message.PayloadMaxSize)
            {
                return Error(ErrorCode.InvalidPara, $"input value is bigger than {Message.PayloadMaxSize}");
            }
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "setMaxBlockSize", new ContractParameter
            {
                Type = ContractParameterType.Integer,
                Value = max
            });

            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }

        public async Task<long> GetMaxBlockSystemFee()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            return NativeContract.Policy.GetMaxBlockSystemFee(snapshot);
        }


        public async Task<object> SetMaxBlockSystemFee(long max, List<UInt160> signers = null)
        {
            if (max <= 4007600)
            {
                return Error(ErrorCode.InvalidPara, $"input value is less than 4007600");
            }
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "setMaxBlockSystemFee", new ContractParameter
            {
                Type = ContractParameterType.Integer,
                Value = max
            });
            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }

        public async Task<long> GetFeePerByte()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            return NativeContract.Policy.GetFeePerByte(snapshot);
        }


        public async Task<object> SetFeePerByte(long fee, List<UInt160> signers = null)
        {
            if (fee < 0 || fee > 1_00000000)
            {
                return Error(ErrorCode.InvalidPara, $"input value should between 0 and  100,000,000");
            }
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "setFeePerByte", new ContractParameter
            {
                Type = ContractParameterType.Integer,
                Value = fee
            });
            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }

        public async Task<bool> IsBlocked(UInt160 account)
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            return NativeContract.Policy.IsBlocked(snapshot, account);
        }


        public async Task<object> BlockAccount(UInt160 account, List<UInt160> signers = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "blockAccount", new ContractParameter
            {
                Type = ContractParameterType.Hash160,
                Value = account
            });
            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }



        public async Task<object> UnblockAccount(UInt160 account, List<UInt160> signers = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.Policy.Hash, "unblockAccount", new ContractParameter
            {
                Type = ContractParameterType.Hash160,
                Value = account
            });
            if (signers == null)
            {
                signers = new List<UInt160>();
            }
            var committee = NativeContract.NEO.GetCommitteeAddress(snapshot);
            signers.Add(committee);
            return await SignAndBroadcastTx(sb.ToArray(), signers.ToArray());
        }

        #endregion
    }
}
