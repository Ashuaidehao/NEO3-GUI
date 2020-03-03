using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
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
using Neo.Network.P2P;
using Neo.Network.P2P.Payloads;
using Akka.Actor;
using Neo.Models.Transactions;
using Neo.Storage;
using ECCurve = Neo.Cryptography.ECC.ECCurve;
using ECPoint = Neo.Cryptography.ECC.ECPoint;


namespace Neo.Invokers
{
    public class WalletInvoker : Invoker
    {
        protected Wallet CurrentWallet => Program.Service.CurrentWallet;


        /// <summary>
        /// open wallet
        /// </summary>
        /// <param name="path">wallet path</param>
        /// <param name="password">wallet password</param>
        /// <returns></returns>
        public async Task<object> OpenWallet(string path, string password)
        {
            if (!File.Exists(path))
            {
                return Error(ErrorCode.WalletFileNotFound);
            }
            try
            {
                Program.Service.OpenWallet(path, password);
            }
            catch (CryptographicException e)
            {
                return Error(ErrorCode.WrongPassword);
            }
            catch (Exception e)
            {
                return Error(ErrorCode.FailToOpenWallet);
            }
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
        public async Task<object> CreateWallet(string path, string password, string privateKey = null)
        {
            var result = new WalletModel();
            var hexPrivateKey = privateKey.TryGetPrivateKey();
            try
            {
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
            }
            catch (CryptographicException e)
            {
                return Error(ErrorCode.WrongPassword);
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
                return Error(ErrorCode.CreateMultiContractFail);
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
                return Error(ErrorCode.CreateContractAddressFail);
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
        public async Task<object> DeleteAddress(UInt160[] addresses)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var result = addresses.Select(scriptHash => CurrentWallet.DeleteAccount(scriptHash)).ToList();
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
        /// list current wallet address
        /// </summary>
        /// <returns></returns>
        public async Task<object> ListPublicKey(int count = 100)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var accounts = CurrentWallet.GetAccounts().Where(a => a.HasKey).Take(count).ToList();
            return accounts.Select(a => new PublicKeyModel
            {
                Address = a.Address,
                PublicKey = a.GetKey().PublicKey.EncodePoint(true),
            });
        }

        /// <summary>
        /// import watch only addresses
        /// </summary>
        /// <param name="addresses"></param>
        /// <returns></returns>
        public async Task<object> ImportWatchOnlyAddress(UInt160[] addresses)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var importedAccounts = new List<AccountModel>();
            foreach (var address in addresses)
            {
                var account = CurrentWallet.CreateAccount(address);
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
            foreach (var wif in wifs)
            {
                var priKey = wif.TryGetPrivateKey();
                if (priKey.IsNull())
                {
                    return Error(ErrorCode.InvalidPrivateKey);
                }
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
        public async Task<object> ShowPrivateKey(UInt160 address)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            var account = CurrentWallet.GetAccount(address);
            if (account == null)
            {
                return Error(ErrorCode.AddressNotFound);
            }
            if (!account.HasKey)
            {
                return Error(ErrorCode.AddressNotFoundPrivateKey);
            }
            var key = account.GetKey();
            return new PrivateKeyModel()
            {
                ScriptHash = address,
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
            try
            {
                Transaction tx = CurrentWallet.MakeTransaction(outputs);
                if (tx == null)
                {
                    return Error(ErrorCode.ClaimGasFail);
                }
                ContractParametersContext context = new ContractParametersContext(tx);
                CurrentWallet.Sign(context);
                if (!context.Completed)
                {
                    return Error(ErrorCode.SignFail, $"SignatureContext:{context}");
                }
                tx.Witnesses = context.GetWitnesses();
                Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
                Task.Run(() => UnconfirmedTransactionCache.AddTransaction(tx));
                return new TransactionModel(tx);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                return Error(ErrorCode.ClaimGasFail, ex.Message);
            }
        }



        /// <summary>
        /// send asset
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="receiver"></param>
        /// <param name="amount"></param>
        /// <param name="asset"></param>
        /// <returns></returns>
        public async Task<object> SendToAddress(UInt160 receiver, string amount, string asset = "neo", UInt160 sender = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }
            if (receiver == null)
            {
                return Error(ErrorCode.ParameterIsNull, $"receiver address is null!");
            }
            UInt160 assetHash = ConvertToAssetId(asset, out var convertError);
            if (assetHash == null)
            {
                return Error(ErrorCode.InvalidPara, $"asset is not valid:{convertError}");
            }
            var assetInfo = AssetCache.GetAssetInfo(assetHash);
            if (assetInfo == null)
            {
                return Error(ErrorCode.InvalidPara, $"asset is not valid:{convertError}");
            }
            if (!BigDecimal.TryParse(amount, assetInfo.Decimals, out BigDecimal sendAmount) || sendAmount.Sign <= 0)
            {
                return Error(ErrorCode.InvalidPara, "Incorrect Amount Format");
            }

            if (sender != null)
            {
                var account = CurrentWallet.GetAccount(sender);
                if (account == null)
                {
                    return Error(ErrorCode.AddressNotFound);
                }
                var balance = sender.GetBalanceOf(assetHash);
                if (balance.Value < sendAmount.Value)
                {
                    return Error(ErrorCode.BalanceNotEnough);
                }
            }

            try
            {
                Transaction tx = CurrentWallet.MakeTransaction(new[]
                {
                    new TransferOutput
                    {
                        AssetId = assetHash,
                        Value = sendAmount,
                        ScriptHash = receiver
                    }
                }, sender);

                if (tx == null)
                {
                    return Error(ErrorCode.BalanceNotEnough, "Insufficient funds");
                }

                ContractParametersContext context = new ContractParametersContext(tx);
                CurrentWallet.Sign(context);
                if (!context.Completed)
                {
                    return Error(ErrorCode.SignFail, $"SignatureContext:{context}");
                }
                tx.Witnesses = context.GetWitnesses();
                Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
                Task.Run(() => UnconfirmedTransactionCache.AddTransaction(tx));
                return new TransactionModel(tx);

            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                return Error(ErrorCode.TransferError, ex.Message);
            }
        }


        /// <summary>
        /// send asset
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="receivers"></param>
        /// <param name="asset"></param>
        /// <returns></returns>
        public async Task<object> SendToMultiAddress(MultiReceiverRequest[] receivers, string asset = "neo", UInt160 sender = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            if (receivers.IsEmpty())
            {
                return Error(ErrorCode.ParameterIsNull, $"receivers is null!");
            }
            UInt160 assetHash = ConvertToAssetId(asset, out var convertError);
            if (assetHash == null)
            {
                return Error(ErrorCode.InvalidPara, $"asset is not valid:{convertError}");
            }

            var assetInfo = AssetCache.GetAssetInfo(assetHash);
            if (assetInfo == null)
            {
                return Error(ErrorCode.InvalidPara, $"asset is not valid:{convertError}");
            }
            if (sender != null)
            {
                var account = CurrentWallet.GetAccount(sender);
                if (account == null)
                {
                    return Error(ErrorCode.AddressNotFound);
                }
            }
            var toes = new List<(UInt160 scriptHash, BigDecimal amount)>();
            foreach (var receiver in receivers)
            {
                if (!BigDecimal.TryParse(receiver.Amount, assetInfo.Decimals, out BigDecimal sendAmount) || sendAmount.Sign <= 0)
                {
                    return Error(ErrorCode.InvalidPara, $"Incorrect Amount Format:{receiver.Amount}");
                }
                toes.Add((receiver.Address, sendAmount));
            }
            var outputs = toes.Select(t => new TransferOutput()
            {
                AssetId = assetHash,
                Value = t.amount,
                ScriptHash = t.scriptHash,
            }).ToArray();

            try
            {
                Transaction tx = CurrentWallet.MakeTransaction(outputs, sender);
                if (tx == null)
                {
                    return Error(ErrorCode.BalanceNotEnough, "Insufficient funds");
                }

                ContractParametersContext context = new ContractParametersContext(tx);
                CurrentWallet.Sign(context);
                if (!context.Completed)
                {
                    return Error(ErrorCode.SignFail, $"SignatureContext:{context}");
                }
                tx.Witnesses = context.GetWitnesses();
                Program.Service.NeoSystem.LocalNode.Tell(new LocalNode.Relay { Inventory = tx });
                Task.Run(() => UnconfirmedTransactionCache.AddTransaction(tx));
                return new TransactionModel(tx);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Insufficient GAS"))
                {
                    return Error(ErrorCode.GasNotEnough);
                }
                return Error(ErrorCode.TransferError, ex.Message);
            }
        }


        /// <summary>
        /// get my unconfirmed transactions
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyUnconfirmedTransactions()
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();
            var tempTransactions = UnconfirmedTransactionCache.GetUnconfirmedTransactions(addresses);
            return tempTransactions.Select(t => t.ToTransactionPreviewModel());
        }

        /// <summary>
        /// query relate my wallet transactions(on chain)
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyTransactions(int limit = 100, UInt160 address = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = address != null ? new List<UInt160>() { address } : CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();
            using var db = new TrackDB();
            var trans = db.FindTransactions(new TrackFilter() { FromOrTo = addresses, PageIndex = 1, PageSize = limit }).List;
            return trans.ToTransactionPreviewModel();
        }

        /// <summary>
        /// query relate my wallet balances
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyBalances(UInt160 address = null, UInt160[] assets = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();
            if (address != null)
            {
                if (!addresses.Contains(address))
                {
                    return Error(ErrorCode.AddressNotFound);
                }
                addresses = new List<UInt160>() { address };
            }

            using var db = new TrackDB();
            var balances = db.FindAssetBalance(new BalanceFilter() { Addresses = addresses, Assets = assets });

            return balances.OrderByDescending(b => b.Balance).Select(b => new AddressBalanceModel(b));
        }

        /// <summary>
        /// query relate my wallet balances
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMyTotalBalance(UInt160[] assets = null)
        {
            if (CurrentWallet == null)
            {
                return Error(ErrorCode.WalletNotOpen);
            }

            var addresses = CurrentWallet.GetAccounts().Select(a => a.ScriptHash).ToList();

            using var db = new TrackDB();
            var balances = db.FindAssetBalance(new BalanceFilter() { Addresses = addresses, Assets = assets });

            return balances.GroupBy(b => new { b.Asset, b.AssetDecimals, b.AssetSymbol }).Select(g => new AssetBalanceModel
            {
                Asset = g.Key.Asset,
                Symbol = g.Key.AssetSymbol,
                Balance = new BigDecimal(g.Select(b => b.Balance).Sum(), g.Key.AssetDecimals)
            });
        }




        #region Private

        //private List<TransactionPreviewModel> ConvertToTransactionPreviewModel(IEnumerable<TransferInfo> trans)
        //{
        //    return trans.ToLookup(x => x.TxId).Select(ToTransactionPreviewModel).ToList();
        //}

        //private TransactionPreviewModel ToTransactionPreviewModel(IGrouping<UInt256, TransferInfo> lookup)
        //{
        //    var item = lookup.FirstOrDefault();
        //    var model = new TransactionPreviewModel()
        //    {
        //        TxId = lookup.Key,
        //        Timestamp = item.TimeStamp,
        //        BlockHeight = item.BlockHeight,
        //        Transfers = lookup.Select(x => x.ToTransferModel()).ToList(),
        //    };
        //    return model;
        //}


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
