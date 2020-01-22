using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using Neo.Models;
using Neo.Storage.SQLiteModules;

namespace Neo.Storage
{
    public class TrackDB
    {

        private SQLiteContext _db = new SQLiteContext("test.db");


        public void Commit()
        {
            _db.SaveChanges();
        }


        public void AddSyncIndex(uint index)
        {
            _db.SyncIndices.Add(new SyncIndex() { BlockHeight = index });
        }

        public bool GetSyncIndex(uint index)
        {
            return _db.SyncIndices.FirstOrDefault(s => s.BlockHeight == index) != null;
        }

        public void AddTransfer(TransferInfo newTransaction)
        {
            var tran = new Nep5TransactionEntity
            {
                BlockHeight = newTransaction.BlockHeight,
                TxId = newTransaction.TxId.ToHexString(),
                From = newTransaction.From.ToHexString(),
                To = newTransaction.To.ToHexString(),
                FromBalance = newTransaction.FromBalance.ToByteArray(),
                ToBalance = newTransaction.ToBalance.ToByteArray(),
                Amount = newTransaction.Amount.ToByteArray(),
                AssetId = newTransaction.AssetId.ToHexString(),
                Time = newTransaction.TimeStamp.FromTimestampMS(),
            };
            _db.Nep5Transactions.Add(tran);
        }





        public IEnumerable<TransferInfo> FindTransfer(TrackFilter filter)
        {
            IQueryable<Nep5TransactionEntity> query = _db.Nep5Transactions;
            if (filter.FromOrToAddreses.NotEmpty())
            {
                var addresses = filter.FromOrToAddreses.Select(a => a.ToHexString()).ToList();
                query = query.Where(r => addresses.Contains(r.From) || addresses.Contains(r.To));
            }
            if (filter.FromOrTo != null)
            {
                var address = filter.FromOrTo.ToHexString();
                query = query.Where(r => r.From == address || r.To == address);
            }
            if (filter.From != null)
            {
                query = query.Where(r => r.From == filter.From.ToHexString());
            }
            if (filter.To != null)
            {
                query = query.Where(r => r.To == filter.To.ToHexString());
            }
            if (filter.StartTime != null)
            {
                query = query.Where(r => r.Time >= filter.StartTime.Value.ToUniversalTime());
            }
            if (filter.EndTime != null)
            {
                query = query.Where(r => r.Time <= filter.EndTime.Value.ToUniversalTime());
            }
            if (filter.AssetId != null)
            {
                query = query.Where(r => r.AssetId == filter.AssetId.ToHexString());
            }
            if (filter.BlockHeight != null)
            {
                query = query.Where(r => r.BlockHeight == filter.BlockHeight);
            }
            if (filter.TxId != null)
            {
                query = query.Where(r => r.TxId == filter.TxId.ToHexString());
            }
            return query.OrderByDescending(r => r.Time).ToList().Select(ToNep5TransferInfo);
        }



        private TransferInfo ToNep5TransferInfo(Nep5TransactionEntity entity)
        {
            return new TransferInfo()
            {
                BlockHeight = entity.BlockHeight,
                TxId = UInt256.Parse(entity.TxId),
                From = UInt160.Parse(entity.From),
                To = UInt160.Parse(entity.To),
                FromBalance = new BigInteger(entity.FromBalance),
                ToBalance = new BigInteger(entity.ToBalance),
                Amount = new BigInteger(entity.Amount),
                AssetId = UInt160.Parse(entity.AssetId),

                TimeStamp = entity.Time.AsUtcTime().ToTimestampMS(),
            };
        }
    }
}
