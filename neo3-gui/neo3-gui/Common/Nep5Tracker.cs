using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Neo.IO;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.Plugins;
using Neo.Storage;
using Neo.VM;
using Neo.VM.Types;
using Neo.Wallets;
using VMArray = Neo.VM.Types.Array;

namespace Neo.Common
{
    public class Nep5Tracker : Plugin, IPersistencePlugin
    {

        private readonly TrackDB _db = new TrackDB();
        public void OnPersist(StoreView snapshot, IReadOnlyList<Blockchain.ApplicationExecuted> applicationExecutedList)
        {

            Header header = snapshot.GetHeader(snapshot.CurrentBlockHash);

            if (_db.GetSyncIndex(header.Index))
            {
                //already synced pass
                return;
            }
            foreach (Blockchain.ApplicationExecuted appExecuted in applicationExecutedList)
            {
                // Executions that fault won't modify storage, so we can skip them.
                if (appExecuted.VMState.HasFlag(VMState.FAULT)) continue;
                foreach (var notifyEventArgs in appExecuted.Notifications)
                {
                    if (!(notifyEventArgs?.State is VMArray stateItems)
                        || stateItems.Count == 0
                        || !(notifyEventArgs.ScriptContainer is Transaction transaction))
                    {
                        continue;
                    }

                    HandleNotification(snapshot, transaction, notifyEventArgs.ScriptHash, stateItems, header);
                }
            }
            _db.AddSyncIndex(header.Index);

        }

        public void OnCommit(StoreView snapshot)
        {
            _db.Commit();
        }

        public bool ShouldThrowExceptionFromCommit(Exception ex)
        {
            return true;
        }


        private void HandleNotification(StoreView snapshot, Transaction transaction, UInt160 scriptHash, VMArray stateItems, Header header)
        {
            if (stateItems.Count < 4) return;
            // Event name should be encoded as a byte array.
            if (stateItems[0].NotVmByteArray()) return;

            var eventName = stateItems[0].GetString();
            if (eventName != "Transfer") return;

            var fromItem = stateItems[1];

            if (fromItem.NotVmByteArray() && fromItem.NotVmNull()) return;

            var toItem = stateItems[2];
            if (toItem != null && toItem.NotVmByteArray()) return;

            var amountItem = stateItems[3];
            if (amountItem.NotVmByteArray() && amountItem.NotVmInt()) return;

            byte[] fromBytes = fromItem is Null ? null : fromItem?.GetSpan().ToArray();
            if (fromBytes?.Length != 20) fromBytes = null;
            byte[] toBytes = toItem?.GetSpan().ToArray();
            if (toBytes?.Length != 20) toBytes = null;
            if (fromBytes==null && toBytes == null) return;
            var from = fromBytes == null ? null : new UInt160(fromBytes);
            var to = new UInt160(toBytes);
            var amount = amountItem.GetBigInteger();
            var fromBalance = from?.GetBalanceOf(scriptHash, snapshot);
            var toBalance = to.GetBalanceOf(scriptHash, snapshot);

            var record = new TransferInfo
            {
                BlockHeight = header.Index,
                From = from,
                FromBalance = fromBalance?.Value ?? 0,
                To = to,
                ToBalance = toBalance.Value,
                AssetId = scriptHash,
                Amount = amount,
                TxId = transaction.Hash,
                TimeStamp = header.Timestamp,
            };
            _db.AddTransfer(record);

            Console.WriteLine($"[{from}:{fromBalance}]=>[{to}:{toBalance}]:{amount}");



        }


        
    }
}
