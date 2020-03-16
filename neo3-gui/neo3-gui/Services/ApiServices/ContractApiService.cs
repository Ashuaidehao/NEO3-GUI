using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;
using Neo.IO;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Contracts;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract;
using Neo.SmartContract.Manifest;
using Neo.SmartContract.Native;
using Neo.VM;
using Neo.Wallets;

namespace Neo.Services.ApiServices
{
    public class ContractApiService : ApiService
    {

        protected Wallet CurrentWallet => Program.Starter.CurrentWallet;

        public async Task<object> GetContract(UInt160 contractHash)
        {
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            var contract = snapshot.Contracts.TryGet(contractHash);
            return new ContractModel(contract);
        }


        public async Task<object> DeployContract(string nefPath, string manifestPath = null, bool sendTx = false)
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
            ContractManifest manifest=ReadManifestFile(manifestPath);
            // Basic script checks
            await CheckBadOpcode(nefFile.Script);

            // Build script
            using ScriptBuilder sb = new ScriptBuilder();
            sb.EmitSysCall(InteropService.Contract.Create, nefFile.Script, manifest.ToJson().ToString());
            var script = sb.ToArray();

            Transaction tx;
            try
            {
                tx = CurrentWallet.MakeTransaction(script);
            }
            catch (InvalidOperationException)
            {
                return Error(ErrorCode.EngineFault);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                throw;
            }

            var result = new DeployResultModel
            {
                ContractHash = nefFile.ScriptHash,
                GasConsumed = new BigDecimal(tx.SystemFee, NativeContract.GAS.Decimals)
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
                return ContractManifest.Parse(File.ReadAllText(manifestPath));
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
            // Basic script checks
            using var engine = new ApplicationEngine(TriggerType.Application, null, null, 0, true);
            var context = engine.LoadScript(script);
            while (context.InstructionPointer <= context.Script.Length)
            {
                // Check bad opcodes
                var ci = context.CurrentInstruction;
                if (ci == null || !Enum.IsDefined(typeof(OpCode), ci.OpCode))
                {
                    throw new WsException(ErrorCode.InvalidOpCode, $"OpCode not found at {context.InstructionPointer}-{(byte?)ci?.OpCode:x2}.");
                }
                // Check bad syscalls (NEO2)
                if (ci.OpCode == OpCode.SYSCALL && InteropService.SupportedMethods().All(u => u.Hash != ci.TokenU32))
                {
                    throw new WsException(ErrorCode.InvalidOpCode, $"Syscall not found {ci.TokenU32:x2}. Are you using a NEO2 smartContract?");
                }
                context.InstructionPointer += ci.Size;
            }
        }
    }
}
