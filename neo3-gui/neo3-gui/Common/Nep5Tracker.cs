using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Neo.IO;
using Neo.IO.Json;
using Neo.Ledger;
using Neo.Models;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.Plugins;
using Neo.Storage;
using Neo.Storage.SQLiteModules;
using Neo.Tools;
using Neo.VM;
using Neo.VM.Types;
using Neo.Wallets;
using VMArray = Neo.VM.Types.Array;

namespace Neo.Common
{
    public class Nep5Tracker : Plugin, IPersistencePlugin
    {
        private TrackDB _db = new TrackDB();

        public void CommitAndResetDb()
        {
            if (_db.LiveTime.TotalSeconds >= 1)
            {
                CommitAsync(_db);
                _db = new TrackDB();
            }
        }

        private Task CommitAsync(TrackDB db)
        {
            return Task.Run(() =>
            {
                db.Commit();
                db.Dispose();
            });
        }

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
                if (appExecuted.Transaction == null)
                {
                    continue;//ignore system trigger
                }

                var log = new ExecuteResultEntity();
                log.TxId = appExecuted.Transaction?.Hash.ToBigEndianHex();
                log.Trigger = appExecuted.Trigger;
                log.VMState = appExecuted.VMState;
                log.GasConsumed = appExecuted.GasConsumed;
                try
                {
                    var results = appExecuted.Stack.Select(q => q.ToParameter().ToJson());
                    log.ResultStack = results.SerializeJson();
                }
                catch (InvalidOperationException)
                {
                    log.ResultStack = "error: recursive reference";
                }
                log.Notifications = appExecuted.Notifications.Select(q =>
                {
                    var notification = new NotifyEventEntity();
                    notification.Contract = q.ScriptHash.ToBigEndianHex();
                    try
                    {
                        notification.State = q.State.ToParameter().ToJson().ToString();
                    }
                    catch (InvalidOperationException)
                    {
                        notification.State = "error: recursive reference";
                    }
                    return notification;
                }).ToList();

                _db.AddExecuteResult(log);
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
            CommitAndResetDb();
        }

        public bool ShouldThrowExceptionFromCommit(Exception ex)
        {
            return true;
        }


        private void HandleNotification(StoreView snapshot, Transaction transaction, UInt160 scriptHash, VMArray stateItems, Header header)
        {
            var transferNotify = stateItems.GetTransferNotify(scriptHash);
            if (transferNotify == null)
            {
                return;
            }

            var fromBalance = transferNotify.From?.GetBalanceOf(scriptHash, snapshot);
            var toBalance = transferNotify.To == transferNotify.From ? fromBalance : transferNotify.To.GetBalanceOf(scriptHash, snapshot);
            var asset = AssetCache.GetAssetInfo(scriptHash, snapshot);
            var record = new TransferInfo
            {
                BlockHeight = header.Index,
                From = transferNotify.From,
                FromBalance = fromBalance?.Value ?? 0,
                To = transferNotify.To,
                ToBalance = toBalance?.Value ?? 0,
                Asset = scriptHash,
                Amount = transferNotify.Amount,
                TxId = transaction.Hash,
                TimeStamp = header.Timestamp,
                AssetInfo = asset,
            };
            _db.AddTransfer(record);

            Console.WriteLine($"[{transferNotify.From}:{fromBalance}]=>[{transferNotify.To}:{toBalance}]:{transferNotify.Amount}");

        }



    }
}
