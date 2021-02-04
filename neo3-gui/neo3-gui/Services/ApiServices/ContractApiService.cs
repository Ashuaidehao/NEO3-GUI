using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Neo.Common;
using Neo.Common.Storage;
using Neo.Common.Utility;
using Neo.Cryptography.ECC;
using Neo.IO;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Blocks;
using Neo.Models.Contracts;
using Neo.Network.P2P;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract;
using Neo.SmartContract.Manifest;
using Neo.SmartContract.Native;
using Neo.VM;
using Neo.Wallets;
using Neo.Wallets.SQLite;

namespace Neo.Services.ApiServices
{
    public class ContractApiService : ApiService
    {


        public async Task<object> GetAllContracts()
        {
            var list = new List<ContractInfoModel>();
            list.AddRange(NativeContract.Contracts.Select(c => new ContractInfoModel()
            {
                Hash = c.Hash,
                Name = c.Name,
            }));
            var nativeHashes = new HashSet<UInt160>(list.Select(x => x.Hash));
            using var db = new TrackDB();
            var assets = db.GetAllContracts()?.Where(a => !nativeHashes.Contains(a.Hash)).Select(a =>
                new ContractInfoModel()
                {
                    Hash = a.Hash,
                    Name = a.Name,
                }).ToList();
            list.AddRange(assets);
            return list;
        }

        public async Task<object> GetContract(UInt160 contractHash)
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var contract = snapshot.GetContract(contractHash);
            if (contract == null)
            {
                return Error(ErrorCode.UnknownContract);
            }
            var model = new ContractModel(contract)
            {
                ContractHash = contractHash,
            };
            return model;
        }

        public async Task<object> GetManifestFile(UInt160 contractHash)
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var contract = snapshot.GetContract(contractHash);
            if (contract == null)
            {
                return Error(ErrorCode.UnknownContract);
            }
            return contract.Manifest.ToJson();
        }


        public async Task<object> DeployContract(string nefPath, string manifestPath = null, bool sendTx = false, UInt160 sender = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            if (nefPath.IsNull())
            {
                return Error(ErrorCode.ParameterIsNull, "nefPath is empty.");
            }
            if (manifestPath.IsNull())
            {
                manifestPath = Path.ChangeExtension(nefPath, ".manifest.json");
            }
            // Read nef
            NefFile nefFile = ReadNefFile(nefPath);
            // Read manifest
            ContractManifest manifest = ReadManifestFile(manifestPath);
            // Basic script checks
            await CheckBadOpcode(nefFile.Script);

            // Build script
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.ContractManagement.Hash, "deploy", nefFile.ToArray(),
                manifest.ToJson().ToString());
            //sb.EmitAppCall(NativeContract.Management.Hash, "deploy", nefFile.ToArray(), manifest.ToJson().ToString());
            var script = sb.ToArray();

            Transaction tx;
            try
            {
                tx = CurrentWallet.MakeTransaction(script, sender);
            }
            catch (InvalidOperationException ex)
            {
                return Error(ErrorCode.EngineFault, ex.GetExMessage());
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                throw;
            }

            UInt160 hash = SmartContract.Helper.GetContractHash(tx.Sender, nefFile.CheckSum, manifest.Name);

            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var oldContract = NativeContract.ContractManagement.GetContract(snapshot, hash);
            if (oldContract != null)
            {
                return Error(ErrorCode.ContractAlreadyExist);
            }
            var result = new DeployResultModel
            {
                ContractHash = hash,
                GasConsumed = new BigDecimal((BigInteger)tx.SystemFee, NativeContract.GAS.Decimals)
            };
            if (sendTx)
            {
                var (signSuccess, context) = CurrentWallet.TrySignTx(tx);
                if (!signSuccess)
                {
                    return Error(ErrorCode.SignFail, context.SafeSerialize());
                }
                await tx.Broadcast();
                result.TxId = tx.Hash;
            }
            return result;
        }

        public async Task<object> InvokeContract(InvokeContractParameterModel para)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            if (para.ContractHash == null || para.Method.IsNull())
            {
                return Error(ErrorCode.ParameterIsNull);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var contract = snapshot.GetContract(para.ContractHash);
            if (contract == null)
            {
                return Error(ErrorCode.UnknownContract);
            }

            ContractParameter[] contractParameters = null;
            try
            {
                contractParameters = para.Parameters?.Select(JsonToContractParameter).ToArray();
            }
            catch (Exception e)
            {
                return Error(ErrorCode.InvalidPara);
            }

            var signers = new List<Signer>();
            if (para.Cosigners.NotEmpty())
            {
                signers.AddRange(para.Cosigners.Select(s => new Signer() { Account = s.Account, Scopes = s.Scopes, AllowedContracts = new UInt160[0] }));
            }

            Transaction tx = null;
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(para.ContractHash, para.Method, contractParameters);

            try
            {
                tx = CurrentWallet.InitTransaction(sb.ToArray(), signers.ToArray());
            }
            catch (InvalidOperationException ex)
            {
                return Error(ErrorCode.EngineFault, ex.Message);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                throw;
            }

            var (signSuccess, context) = CurrentWallet.TrySignTx(tx);
            if (!signSuccess)
            {
                return Error(ErrorCode.SignFail, context.SafeSerialize());
            }
            var result = new InvokeResultModel();
            using ApplicationEngine engine = tx.Script.RunTestMode(null, tx);
            result.VmState = engine.State;
            result.GasConsumed = new BigDecimal((BigInteger)tx.SystemFee, NativeContract.GAS.Decimals);
            result.ResultStack = engine.ResultStack.Select(p => JStackItem.FromJson(p.ToParameter().ToJson())).ToList();
            if (engine.State.HasFlag(VMState.FAULT))
            {
                return Error(ErrorCode.EngineFault);
            }
            if (!para.SendTx)
            {
                return result;
            }
            await tx.Broadcast();
            result.TxId = tx.Hash;
            return result;
        }



        public static ContractParameter JsonToContractParameter(JObject json)
        {
            ContractParameter parameter = new ContractParameter
            {
                Type = json["type"].TryGetEnum<ContractParameterType>()
            };
            if (json["value"] == null)
            {
                return parameter;
            }
            if (json["type"].AsString() == "Address")
            {
                parameter.Type = ContractParameterType.Hash160;
                parameter.Value = json["value"].AsString().ToScriptHash();
                return parameter;
            }
            switch (parameter.Type)
            {
                case ContractParameterType.Signature:
                case ContractParameterType.ByteArray:
                    parameter.Value = Convert.FromBase64String(json["value"].AsString());
                    break;
                case ContractParameterType.Boolean:
                    parameter.Value = json["value"].AsBoolean();
                    break;
                case ContractParameterType.Integer:
                    parameter.Value = BigInteger.Parse(json["value"].AsString());
                    break;
                case ContractParameterType.Hash160:
                    parameter.Value = UInt160.Parse(json["value"].AsString());
                    break;
                case ContractParameterType.Hash256:
                    parameter.Value = UInt256.Parse(json["value"].AsString());
                    break;
                case ContractParameterType.PublicKey:
                    parameter.Value = ECPoint.Parse(json["value"].AsString(), ECCurve.Secp256r1);
                    break;
                case ContractParameterType.String:
                    parameter.Value = json["value"].AsString();
                    break;
                case ContractParameterType.Array:
                    parameter.Value = ((JArray)json["value"]).Select(p => JsonToContractParameter(p)).ToList();
                    break;
                case ContractParameterType.Map:
                    parameter.Value = ((JArray)json["value"]).Select(p =>
                       new KeyValuePair<ContractParameter, ContractParameter>(JsonToContractParameter(p["key"]),
                           JsonToContractParameter(p["value"]))).ToList();
                    break;
                default:
                    throw new ArgumentException();
            }
            return parameter;
        }



        public async Task<object> ParseScript(byte[] script)
        {
            return OpCodeConverter.Parse(script);
        }

        #region Vote


        /// <summary>
        /// Get all working or candidate validators
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetValidators()
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var validators = NativeContract.NEO.GetCommittee(snapshot);
            var candidates = NativeContract.NEO.GetCandidates(snapshot);
            return candidates.OrderByDescending(v => v.Votes).Select(p => new ValidatorModel
            {
                Publickey = p.PublicKey.ToString(),
                Votes = p.Votes.ToString(),
                Active = validators.Contains(p.PublicKey)
            }).ToArray();
        }




        /// <summary>
        /// apply for new validator
        /// </summary>
        /// <param name="pubkey"></param>
        /// <returns></returns>
        public async Task<object> ApplyForValidator(string pubkey)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            if (pubkey.IsNull())
            {
                return Error(ErrorCode.ParameterIsNull);
            }
            ECPoint publicKey = null;
            try
            {
                publicKey = ECPoint.Parse(pubkey, ECCurve.Secp256r1);
            }
            catch (Exception e)
            {
                return Error(ErrorCode.InvalidPara);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var validators = NativeContract.NEO.GetCommittee(snapshot);
            if (validators.Any(v => v.Equals(publicKey)))
            {
                return Error(ErrorCode.ValidatorAlreadyExist);
            }
            VerificationContract contract = new VerificationContract
            {
                Script = SmartContract.Contract.CreateSignatureRedeemScript(publicKey),
                ParameterList = new[] { ContractParameterType.Signature }
            };

            var account = contract.ScriptHash;
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.NEO.Hash, "registerCandidate", publicKey);

            return await SignAndBroadcastTx(sb.ToArray(), account);
        }




        /// <summary>
        /// vote for consensus node
        /// </summary>
        /// <returns></returns>
        public async Task<object> VoteCN(UInt160 account, string[] pubkeys)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            if (account == null || pubkeys.IsEmpty())
            {
                return Error(ErrorCode.ParameterIsNull);
            }

            ECPoint publicKey = null;
            //ECPoint[] publicKeys = null;
            try
            {
                //publicKeys = pubkeys.Select(p => ECPoint.Parse(p, ECCurve.Secp256r1)).ToArray();
                publicKey = ECPoint.Parse(pubkeys.FirstOrDefault(), ECCurve.Secp256r1);
            }
            catch (Exception e)
            {
                return Error(ErrorCode.InvalidPara);
            }
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitDynamicCall(NativeContract.NEO.Hash, "vote", new ContractParameter
            {
                Type = ContractParameterType.Hash160,
                Value = account
            }, new ContractParameter
            {
                Type = ContractParameterType.PublicKey,
                Value = publicKey
            });

            return await SignAndBroadcastTx(sb.ToArray(), account);
        }


        #endregion


        #region Private


        /// <summary>
        /// try to read nef file
        /// </summary>
        /// <param name="nefPath"></param>
        /// <returns></returns>
        private NefFile ReadNefFile(string nefPath)
        {
            // Read nef
            var nefFileInfo = new FileInfo(nefPath);
            if (!nefFileInfo.Exists)
            {
                throw new WsException(ErrorCode.FileNotExist, $"Nef file does not exist:{nefPath}");
            }
            if (nefFileInfo.Length >= Transaction.MaxTransactionSize)
            {
                throw new WsException(ErrorCode.ExceedMaxTransactionSize);
            }
            using var stream = new BinaryReader(File.OpenRead(nefPath), Encoding.UTF8, false);
            try
            {
                return stream.ReadSerializable<NefFile>();
            }
            catch (Exception)
            {
                throw new WsException(ErrorCode.InvalidNefFile);
            }
        }

        private ContractManifest ReadManifestFile(string manifestPath)
        {
            var maniFileInfo = new FileInfo(manifestPath);
            if (!maniFileInfo.Exists)
            {
                throw new WsException(ErrorCode.FileNotExist, $"Manifest file does not exist:{manifestPath}");
            }
            if (maniFileInfo.Length >= Transaction.MaxTransactionSize)
            {
                throw new WsException(ErrorCode.ExceedMaxTransactionSize);
            }
            try
            {
                return ContractManifest.Parse(File.ReadAllBytes(manifestPath));
            }
            catch (Exception)
            {
                throw new WsException(ErrorCode.InvalidManifestFile);
            }
        }


        /// <summary>
        /// check script if it contains wrong Opcode
        /// </summary>
        /// <param name="script"></param>
        /// <returns></returns>
        private async Task CheckBadOpcode(byte[] script)
        {
            Script scriptCodes = new Script(script);
            for (var i = 0; i < scriptCodes.Length;)
            {
                // Check bad opcodes
                Instruction inst = scriptCodes.GetInstruction(i);
                if (inst is null || !Enum.IsDefined(typeof(OpCode), inst.OpCode))
                {
                    throw new FormatException($"OpCode not found at {i}-{((byte)inst.OpCode):x2}");
                }
                i += inst.Size;
            }
        }


        #endregion
    }
}
