using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Numerics;
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
using Neo.Network.P2P;
using Neo.Network.P2P.Payloads;
using Akka.Actor;
using Neo.Models.Transactions;
using Neo.Storage;


namespace Neo.Invokers
{
    public class WalletInvoker : Invoker
    {
        private WebSocketSession _session;
        protected Wallet CurrentWallet => Program.Service.CurrentWallet;

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
            return GetWalletAddress(CurrentWallet, int.MaxValue);
        }



        /// <summary>
        /// close wallet
        /// </summary>
        /// <returns></returns>
        public async Task<bool> CloseWallet()
        {
            Program.Service.CloseWallet();
            return true;
        }



        /// <summary>
        /// create new wallet
        /// </summary>
        /// <param name="path"></param>
        /// <param name="password"></param>
        /// <param name="privateKey"></param>
        /// <returns></returns>
        public async Task<WalletModel> CreateWallet(string path, string password, string privateKey = null)
        {
            var result = new WalletModel();
            var hexPrivateKey = privateKey.TryGetPrivateKey();
            switch (Path.GetExtension(path))
            {
                case ".db3":
                    {
                        UserWallet wallet = UserWallet.Create(path, password);
                        var account = hexPrivateKey.NotNull() ? wallet.CreateAccount(hexPrivateKey.HexToBytes()) : wallet.CreateAccount();
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
                        var account = hexPrivateKey.NotNull() ? wallet.CreateAccount(hexPrivateKey.HexToBytes()) : wallet.CreateAccount();
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var newAccount = CurrentWallet.CreateAccount();
            if (CurrentWallet is NEP6Wallet wallet)
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var points = publicKeys.Select(p => ECPoint.DecodePoint(p.HexToBytes(), ECCurve.Secp256r1)).ToArray();
            Contract contract = Contract.CreateMultiSigContract(limit, points);
            if (contract == null)
            {
                return Error("create multi address fail!");
            }
            var hashSet = new HashSet<ECPoint>(points);
            var key = CurrentWallet.GetAccounts().FirstOrDefault(p => p.HasKey && hashSet.Contains(p.GetKey().PublicKey))?.GetKey();
            var newAccount = CurrentWallet.CreateAccount(contract, key);
            if (CurrentWallet is NEP6Wallet wallet)
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            Contract contract = Contract.Create(parameterTypes, script.HexToBytes());
            if (contract == null)
            {
                return Error("create multi address fail!");
            }
            byte[] keyBytes = privateKey.ToPrivateKeyBytes();
            var key = new KeyPair(keyBytes);
            var newAccount = CurrentWallet.CreateAccount(contract, key);
            if (CurrentWallet is NEP6Wallet wallet)
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var result = addresses.Select(address => address.ToScriptHash()).Select(scriptHash => CurrentWallet.DeleteAccount(scriptHash)).ToList();
            if (CurrentWallet is NEP6Wallet wallet)
            {
                wallet.Save();
            }
            return result;
        }

        /// <summary>
        /// list current wallet address
        /// </summary>
        /// <returns></returns>
        public async Task<object> ListAddress(int count = 100)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            return GetWalletAddress(CurrentWallet, count);
        }

        /// <summary>
        /// import watch only addresses
        /// </summary>
        /// <param name="addresses"></param>
        /// <returns></returns>
        public async Task<object> ImportWatchOnlyAddress(string[] addresses)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var importedAccounts = new List<AccountModel>();
            foreach (var address in addresses)
            {
                var scriptHash = address.ToScriptHash();
                var account = CurrentWallet.CreateAccount(scriptHash);
                importedAccounts.Add(new AccountModel
                {
                    Address = account.Address,
                    ScriptHash = account.ScriptHash,
                });
            }
            if (CurrentWallet is NEP6Wallet wallet)
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var importedAccounts = new List<AccountModel>();
            foreach (var wif in wifs)
            {
                var account = CurrentWallet.Import(wif);
                importedAccounts.Add(new AccountModel
                {
                    Address = account.Address,
                    ScriptHash = account.ScriptHash,
                });
            }
            if (CurrentWallet is NEP6Wallet wallet)
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
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var scriptHash = address.ToScriptHash();
            var account = CurrentWallet.GetAccount(scriptHash);
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

        /// <summary>
        /// show unclaimed gas amount
        /// </summary>
        /// <returns></returns>
        public async Task<object> ShowGas()
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            BigInteger gas = BigInteger.Zero;
            using (SnapshotView snapshot = Blockchain.Singleton.GetSnapshot())
                foreach (UInt160 account in CurrentWallet.GetAccounts().Select(p => p.ScriptHash))
                {
                    gas += NativeContract.NEO.UnclaimedGas(snapshot, account, snapshot.Height + 1);
                }
            return new UnclaimedGasModel()
            {
                UnclaimedGas = new BigDecimal(gas, NativeContract.GAS.Decimals)
            };
        }

        /// <summary>
        /// show private key
        /// </summary>
        /// <returns></returns>
        public async Task<object> ClaimGas()
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var addresses = CurrentWallet.GetAccounts().Where(a => !a.Lock && !a.WatchOnly).Select(a => a.ScriptHash).ToList();

            var balances = addresses.GetBalanceOf(NativeContract.NEO.Hash);
            var outputs = balances.Select((t, index) => new TransferOutput()
            {
                AssetId = NativeContract.NEO.Hash,
                Value = t,
                ScriptHash = addresses[index],
            }).ToArray();

            Transaction tx = CurrentWallet.MakeTransaction(outputs);
            if (tx == null)
            {
                return Error("Insufficient funds");
            }

            ContractParametersContext context = new ContractParametersContext(tx);
            CurrentWallet.Sign(context);
            if (!context.Completed)
            {
                return Error($"SignatureContext:{context}");
            }
            tx.Witnesses = context.GetWitnesses();
            Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
            return new TransactionModel(tx);
        }



        /// <summary>
        /// send asset
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="receiver"></param>
        /// <param name="amount"></param>
        /// <param name="asset"></param>
        /// <returns></returns>
        public async Task<object> SendToAddress(string sender, string receiver, string amount, string asset = "neo")
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            UInt160 assetId = ConvertToAssetId(asset, out var convertError);
            if (assetId == null)
            {
                return Error($"input asset is not valid:{convertError}");
            }
            UInt160 from = ConvertToAddress(sender, out _);
            UInt160 to = ConvertToAddress(receiver, out var receiverAddressError);
            if (to == null)
            {
                return Error($"receiver address is not valid:{receiverAddressError}");
            }
            AssetDescriptor descriptor = new AssetDescriptor(assetId);
            if (!BigDecimal.TryParse(amount, descriptor.Decimals, out BigDecimal sendAmount) || sendAmount.Sign <= 0)
            {
                return Error("Incorrect Amount Format");
            }
            Transaction tx = CurrentWallet.MakeTransaction(new[]
            {
                new TransferOutput
                {
                    AssetId = assetId,
                    Value = sendAmount,
                    ScriptHash = to
                }
            }, from);

            if (tx == null)
            {
                return Error("Insufficient funds");
            }

            ContractParametersContext context = new ContractParametersContext(tx);
            CurrentWallet.Sign(context);
            if (!context.Completed)
            {
                return Error($"SignatureContext:{context}");
            }
            tx.Witnesses = context.GetWitnesses();
            Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
            return new TransactionModel(tx);
        }


        /// <summary>
        /// send asset
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="receivers"></param>
        /// <param name="asset"></param>
        /// <returns></returns>
        public async Task<object> SendToMultiAddress(string sender, MultiReceiverRequest[] receivers, string asset = "neo")
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            UInt160 assetId = ConvertToAssetId(asset, out var convertError);
            if (assetId == null)
            {
                return Error($"input asset is not valid:{convertError}");
            }
            AssetDescriptor descriptor = new AssetDescriptor(assetId);

            UInt160 from = ConvertToAddress(sender, out _);
            if (receivers.IsEmpty())
            {
                return Error($"receivers is null");
            }

            var toes = new List<(UInt160 scriptHash, BigDecimal amount)>();
            foreach (var receiver in receivers)
            {
                UInt160 to = ConvertToAddress(receiver.Address, out var receiverAddressError);
                if (to == null)
                {
                    return Error($"receiver[{receiver.Address}] address is not valid:{receiverAddressError}");
                }
                if (!BigDecimal.TryParse(receiver.Amount, descriptor.Decimals, out BigDecimal sendAmount) || sendAmount.Sign <= 0)
                {
                    return Error($"Incorrect Amount Format:{receiver.Amount}");
                }
                toes.Add((to, sendAmount));
            }
            var outputs = toes.Select(t => new TransferOutput()
            {
                AssetId = assetId,
                Value = t.amount,
                ScriptHash = t.scriptHash,
            }).ToArray();

            Transaction tx = CurrentWallet.MakeTransaction(outputs, from);
            if (tx == null)
            {
                return Error("Insufficient funds");
            }

            ContractParametersContext context = new ContractParametersContext(tx);
            CurrentWallet.Sign(context);
            if (!context.Completed)
            {
                return Error($"SignatureContext:{context}");
            }
            tx.Witnesses = context.GetWitnesses();
            Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
            return new TransactionModel(tx);
        }

        /// <summary>
        /// query relate my wallet transactions(on chain)
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyTransactions()
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();
            using var db = new TrackDB();
            var trans = db.FindTransfer(new TrackFilter() { FromOrTo = addresses }).List;
            return ConvertToTransactionPreviewModel(trans);
        }

        /// <summary>
        /// query relate my wallet balances(on chain)
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyBalances(UInt160[] assets)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();

            var balances = assets.Where(asset => AssetCache.GetAssetInfo(asset) != null).Select(asset => new WalletBalanceModel()
            {
                Asset = asset,
                Balance = addresses.GetBalanceOf(asset).SumAssetAmount(),
            }).ToList();
            return balances;
        }




        #region Private

        private List<TransactionPreviewModel> ConvertToTransactionPreviewModel(IEnumerable<TransferInfo> trans)
        {
            return trans.ToLookup(x => x.TxId).Select(ToTransactionPreviewModel).ToList();
        }

        private TransactionPreviewModel ToTransactionPreviewModel(IGrouping<UInt256, TransferInfo> lookup)
        {
            var item = lookup.FirstOrDefault();
            var model = new TransactionPreviewModel()
            {
                Hash = lookup.Key.ToString(),
                Timestamp = item.TimeStamp,
                BlockHeight = item.BlockHeight,
                Transfers = lookup.Select(x => x.ToTransferModel()).ToList(),
            };
            return model;
        }


        /// <summary>
        /// convert input address string to address hash
        /// </summary>
        /// <param name="address"></param>
        /// <param name="error"></param>
        /// <returns></returns>
        private UInt160 ConvertToAddress(string address, out string error)
        {
            error = "";
            try
            {
                return address.ToScriptHash();
            }
            catch (Exception e)
            {
                error = e.Message;
                return null;
            }
        }

        /// <summary>
        /// convert input asset string to asset hash
        /// </summary>
        /// <param name="asset"></param>
        /// <returns></returns>
        private UInt160 ConvertToAssetId(string asset, out string error)
        {
            error = "";
            if ("neo".Equals(asset, StringComparison.OrdinalIgnoreCase))
            {
                return NativeContract.NEO.Hash;
            }
            if ("gas".Equals(asset, StringComparison.OrdinalIgnoreCase))
            {
                return NativeContract.GAS.Hash;
            }
            try
            {
                return UInt160.Parse(asset);
            }
            catch (Exception e)
            {
                error = e.Message;
                return null;
            }
        }

        /// <summary>
        /// get all address info from wallet
        /// </summary>
        /// <param name="wallet"></param>
        /// <returns></returns>
        private WalletModel GetWalletAddress(Wallet wallet, int count)
        {
            var result = new WalletModel();
            using (var snapshot = Blockchain.Singleton.GetSnapshot())
            {
                result.Accounts.AddRange(wallet.GetAccounts().Take(count).Select(account => new AccountModel()
                {
                    ScriptHash = account.ScriptHash,
                    Address = account.Address,
                    WatchOnly = account.WatchOnly,
                    AccountType = GetAccountType(account, snapshot),
                }));
            }
            GetNeoAndGas(result.Accounts);
            return result;
        }


        private AccountType GetAccountType(WalletAccount account, SnapshotView snapshot)
        {
            if (account.Contract != null)
            {
                if (account.Contract.Script.IsMultiSigContract(out _, out _))
                {
                    return AccountType.MultiSignature;
                }
                if (account.Contract.Script.IsSignatureContract())
                {
                    return AccountType.Standard;
                }
                if (snapshot.Contracts.TryGet(account.Contract.ScriptHash) != null)
                {
                    return AccountType.DeployedContract;
                }
            }
            return AccountType.NonStandard;
        }

        private List<AccountModel> GetNeoAndGas(IEnumerable<AccountModel> accounts)
        {
            var addresses = accounts.Select(t => t.ScriptHash).ToList();
            var neos = addresses.GetBalanceOf(NativeContract.NEO.Hash);
            var gases = addresses.GetBalanceOf(NativeContract.GAS.Hash);

            return accounts.Select((account, index) =>
            {
                account.Neo = neos[index].ToString();
                account.Gas = gases[index].ToString();
                return account;

            }).ToList();
        }

        #endregion


    }
}
