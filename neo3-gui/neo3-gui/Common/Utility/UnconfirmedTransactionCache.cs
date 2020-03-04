using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.SmartContract;
using VmArray = Neo.VM.Types.Array;

namespace Neo.Common.Utility
{
    public class UnconfirmedTransactionCache
    {
        private static readonly Dictionary<UInt256, TempTransaction> _unconfirmedTransactions = new Dictionary<UInt256, TempTransaction>();

        private static IActorRef _actor;



        public static void RegisterBlockPersistEvent()
        {
            if (_actor == null)
            {
                _actor = Program.Service.NeoSystem.ActorSystem.ActorOf(EventWrapper<Blockchain.PersistCompleted>.Props(Blockchain_PersistCompleted));
            }
        }

        public static void AddTransaction(Transaction tx)
        {
            if (_unconfirmedTransactions.ContainsKey(tx.Hash))
            {
                return;
            }

            var transfers = new List<TransferNotifyItem>();
            using var exeResult = ApplicationEngine.Run(tx.Script, tx, testMode: true);
            if (exeResult.Notifications.NotEmpty())
            {
                foreach (var notification in exeResult.Notifications)
                {
                    if (notification.State is VmArray notifyArray && notifyArray.Count == 4)
                    {
                        var transfer = notifyArray.GetTransferNotify(notification.ScriptHash);
                        if (transfer == null)
                        {
                            continue;
                        }

                        var asset = AssetCache.GetAssetInfo(notification.ScriptHash);
                        transfer.Symbol = asset.Symbol;
                        transfer.Decimals = asset.Decimals;
                        transfers.Add(transfer);
                    }
                }
            }
            SaveTransfer(tx, transfers);
        }

        private static void SaveTransfer(Transaction tx, List<TransferNotifyItem> transfers)
        {
            _unconfirmedTransactions[tx.Hash] = new TempTransaction()
            {
                Tx = tx,
                Transfers = transfers,
            };
        }

        public static void RemoveUnconfirmedTransactions(UInt256 txId)
        {
            _unconfirmedTransactions.Remove(txId);
        }

        public static IEnumerable<TempTransaction> GetUnconfirmedTransactions(IEnumerable<UInt160> addresses = null)
        {
            if (addresses.IsEmpty())
            {
                return _unconfirmedTransactions.Values.Reverse();
            }
            return _unconfirmedTransactions.Values.Where(tx => tx.Transfers.Any(t => addresses.Contains(t.From) || addresses.Contains(t.To))).Reverse();
        }

        private static void Blockchain_PersistCompleted(Blockchain.PersistCompleted e)
        {
            if (e.Block.Transactions.NotEmpty())
            {
                foreach (var blockTransaction in e.Block.Transactions)
                {
                    RemoveUnconfirmedTransactions(blockTransaction.Hash);
                }
            }
        }


        public class TempTransaction
        {
            public Transaction Tx { get; set; }
            public List<TransferNotifyItem> Transfers { get; set; }
        }
    }

}
