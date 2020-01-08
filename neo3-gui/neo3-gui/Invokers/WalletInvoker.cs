using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Numerics;
//using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Akka.Util.Internal;
using Microsoft.VisualBasic;
using Neo.Common;
using Neo.Ledger;
using Neo.Models;
using Neo.Models.Wallets;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.SmartContract.Native;
using Neo.Tools;
using Neo.VM;
using Neo.Wallets;
using Neo.Wallets.NEP6;
using Neo.Wallets.SQLite;
using VMArray = Neo.VM.Types.Array;
using Neo.Cryptography.ECC;


namespace Neo.Invokers
{
    public class WalletInvoker : Invoker
    {
        private WebSocketSession _session;


        public WalletInvoker(WebSocketSession session)
        {
            _session = session;
        }


        /// <summary>
        /// open wallet
        /// </summary>
        /// <param name="path">wallet path</param>
        /// <param name="password">wallet password</param>
        /// <returns></returns>
        public async Task<WalletModel> OpenWallet(string path, string password)
        {
            Program.Service.OpenWallet(path, password);
            var result = new WalletModel();
            using (var snapshot = Blockchain.Singleton.GetSnapshot())
            {
                foreach (var walletAccount in Program.Service.CurrentWallet.GetAccounts())
                {
                    var account = new AccountModel()
                    {
                        ScriptHash = walletAccount.ScriptHash,
                        Address = walletAccount.Address
                    };

                    if (walletAccount.Contract.Script.IsMultiSigContract(out _, out _))
                    {
                        account.AccountType = AccountType.MultiSignature;
                    }
                    else if (walletAccount.Contract.Script.IsSignatureContract())
                    {
                        account.AccountType = AccountType.Standard;
                    }
                    else if (snapshot.Contracts.TryGet(walletAccount.Contract.ScriptHash) != null)
                    {
                        account.AccountType = AccountType.DeployedContract;
                    }
                    result.Accounts.Add(account);
                }
            }
            GetNeoAndGas(result.Accounts);
            return result;
        }


        /// <summary>
        /// create new wallet
        /// </summary>
        /// <param name="path"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<WalletModel> CreateWallet(string path, string password)
        {
            var result = new WalletModel();
            switch (Path.GetExtension(path))
            {
                case ".db3":
                    {
                        UserWallet wallet = UserWallet.Create(path, password);
                        var account = wallet.CreateAccount();
                        result.Accounts.Add(new AccountModel()
                        {
                            AccountType = AccountType.Standard,
                            Address = account.Address,
                            ScriptHash = account.ScriptHash,

                        });
                    }
                    break;
                case ".json":
                    {
                        NEP6Wallet wallet = new NEP6Wallet(path);
                        wallet.Unlock(password);
                        var account = wallet.CreateAccount();
                        wallet.Save();
                        result.Accounts.Add(new AccountModel()
                        {
                            AccountType = AccountType.Standard,
                            ScriptHash = account.ScriptHash,
                            Address = account.Address,
                        });
                    }
                    break;
                default:
                    throw new Exception("Wallet files in that format are not supported, please use a .json or .db3 file extension.");
            }

            GetNeoAndGas(result.Accounts);
            return result;
        }

        /// <summary>
        /// create new standard address
        /// </summary>
        /// <returns></returns>
        public async Task<object> CreateAddress()
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var newAccount = Program.Service.CurrentWallet.CreateAccount();
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            return new AccountModel()
            {
                AccountType = AccountType.Standard,
                Address = newAccount.Address,
                ScriptHash = newAccount.ScriptHash,
            };
        }

        /// <summary>
        /// create new multi address
        /// </summary>
        /// <returns></returns>
        public async Task<object> CreateMultiAddress(int limit, string[] publicKeys)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var points = publicKeys.Select(p => ECPoint.DecodePoint(p.HexToBytes(), ECCurve.Secp256r1)).ToArray();
            Contract contract = Contract.CreateMultiSigContract(limit, points);
            if (contract == null)
            {
                return Error("create multi address fail!");
            }
            var hashSet = new HashSet<ECPoint>(points);
            var key = Program.Service.CurrentWallet.GetAccounts().FirstOrDefault(p => p.HasKey && hashSet.Contains(p.GetKey().PublicKey))?.GetKey();
            var newAccount = Program.Service.CurrentWallet.CreateAccount(contract, key);
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            return new AccountModel()
            {
                AccountType = AccountType.MultiSignature,
                Address = newAccount.Address,
                ScriptHash = newAccount.ScriptHash,
            };
        }

        /// <summary>
        /// create new contract address
        /// </summary>
        /// <param name="parameterTypes"></param>
        /// <param name="script"></param>
        /// <param name="privateKey"></param>
        /// <returns></returns>
        public async Task<object> CreateContractAddress(ContractParameterType[] parameterTypes, string script, string privateKey)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            Contract contract = Contract.Create(parameterTypes, script.HexToBytes());
            if (contract == null)
            {
                return Error("create multi address fail!");
            }
            byte[] keyBytes=privateKey.ToPrivateKeyBytes();
            var key = new KeyPair(keyBytes);
            var newAccount = Program.Service.CurrentWallet.CreateAccount(contract, key);
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            return new AccountModel()
            {
                AccountType = AccountType.NonStandard,
                Address = newAccount.Address,
                ScriptHash = newAccount.ScriptHash,
            };
        }

        /// <summary>
        /// delete a address
        /// </summary>
        /// <returns></returns>
        public async Task<object> DeleteAddress(string[] addresses)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var result = new List<bool>();
            foreach (var address in addresses)
            {
                var scriptHash = address.ToScriptHash();
                result.Add(Program.Service.CurrentWallet.DeleteAccount(scriptHash));
            }
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            return result;
        }

        /// <summary>
        /// import watch only addresses
        /// </summary>
        /// <param name="addresses"></param>
        /// <returns></returns>
        public async Task<object> ImportWatchOnlyAddress(string[] addresses)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var importedAccounts = new List<AccountModel>();
            foreach (var address in addresses)
            {
                var scriptHash = address.ToScriptHash();
                var account = Program.Service.CurrentWallet.CreateAccount(scriptHash);
                importedAccounts.Add(new AccountModel
                {
                    Address = account.Address,
                    ScriptHash = account.ScriptHash,
                });
            }
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            GetNeoAndGas(importedAccounts);
            return importedAccounts;
        }

        /// <summary>
        /// import wif private keys
        /// </summary>
        /// <param name="wifs"></param>
        /// <returns></returns>
        public async Task<object> ImportWif(string[] wifs)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var importedAccounts = new List<AccountModel>();
            foreach (var wif in wifs)
            {
                var account = Program.Service.CurrentWallet.Import(wif);
                importedAccounts.Add(new AccountModel
                {
                    Address = account.Address,
                    ScriptHash = account.ScriptHash,
                });
            }
            if (Program.Service.CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            GetNeoAndGas(importedAccounts);
            return importedAccounts;
        }

        /// <summary>
        /// show private key
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public async Task<object> ShowPrivateKey(string address)
        {
            if (Program.Service.CurrentWallet == null)
            {
                return Error($"please open wallet first.");
            }
            var scriptHash = address.ToScriptHash();
            var account = Program.Service.CurrentWallet.GetAccount(scriptHash);
            if (account == null)
            {
                return Error($"can not find selected address[{address}]");
            }
            if (!account.HasKey)
            {
                return Error($"can not get private key[{address}], only standard address can get private key");
            }
            var key = account.GetKey();
            return new PrivateKeyModel()
            {
                Address = address,
                PublicKey = key.PublicKey.EncodePoint(true).ToHexString(),
                PrivateKey = key.PrivateKey.ToHexString(),
                Wif = key.Export(),
            };
        }


        #region Private


        private List<AccountModel> GetNeoAndGas(IEnumerable<AccountModel> accounts)
        {
            var addresses = accounts.Select(t => t.ScriptHash).ToList();
            var neos = GetBalanceOf(addresses, NativeContract.NEO.Hash);
            var gases = GetBalanceOf(addresses, NativeContract.GAS.Hash);

            return accounts.Select((account, index) =>
            {
                account.Neo = neos[index].ToString();
                account.Gas = gases[index].ToString();
                return account;

            }).ToList();

        }


        private List<BigDecimal> GetBalanceOf(IEnumerable<UInt160> addresses, UInt160 assetId)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                throw new ArgumentException($"invalid assetId:[{assetId}]");
            }
            using SnapshotView snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();

            foreach (var address in addresses)
            {
                sb.EmitAppCall(assetId, "balanceOf", address);
            }
            using ApplicationEngine engine = ApplicationEngine.Run(sb.ToArray(), snapshot, testMode: true);
            if (engine.State.HasFlag(VMState.FAULT))
            {
                throw new Exception($"query balance error");
            }
            var result = engine.ResultStack.Select(p => p.GetBigInteger());
            return result.Select(bigInt => new BigDecimal(bigInt, assetInfo.Decimals)).ToList();
        }

        private BigDecimal GetBalanceOf(UInt160 address, UInt160 assetId)
        {
            var assetInfo = AssetCache.GetAssetInfo(assetId);
            if (assetInfo == null)
            {
                return new BigDecimal(0, 0);
            }
            using var snapshot = Blockchain.Singleton.GetSnapshot();
            using var sb = new ScriptBuilder();

            sb.EmitAppCall(assetId, "balanceOf", address);

            using var engine = ApplicationEngine.Run(sb.ToArray(), snapshot, testMode: true);
            if (engine.State.HasFlag(VMState.FAULT))
            {
                return new BigDecimal(0, 0);
            }
            BigInteger balances = engine.ResultStack.Pop().GetBigInteger();

            return new BigDecimal(balances, assetInfo.Decimals);
        }

        #endregion


    }
}
