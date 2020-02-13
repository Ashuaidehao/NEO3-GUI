using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using Microsoft.EntityFrameworkCore;
using Neo.IO;
using Neo.Models;
using Neo.Storage.SQLiteModules;

namespace Neo.Storage
{
    public class TrackDB : IDisposable
    {

        private SQLiteContext _db;
        private uint _magic;
        public TrackDB()
        {
            _magic = ProtocolSettings.Default.Magic;
            if (!Directory.Exists("Data_Track"))
            {
                Directory.CreateDirectory("Data_Track");
            }
            _db = new SQLiteContext(Path.Combine($"Data_Track", $"test.{_magic}.db"));
        }

        public void Commit()
        {
            _db.SaveChanges();
        }


        public void AddSyncIndex(uint index)
        {
            _db.SyncIndexes.Add(new SyncIndex() { BlockHeight = index });
        }

        public bool GetSyncIndex(uint index)
        {
            return _db.SyncIndexes.FirstOrDefault(s => s.BlockHeight == index) != null;
        }

        public void AddTransfer(TransferInfo newTransaction)
        {
            var from = GetOrCreateAddress(newTransaction.From);
            var to = GetOrCreateAddress(newTransaction.To);
            var asset = GetOrCreateAsset(newTransaction.AssetId);

            var tran = new Nep5TransactionEntity
            {
                BlockHeight = newTransaction.BlockHeight,
                TxId = newTransaction.TxId.ToHexString(),
                FromId = from?.Id,
                ToId = to.Id,
                FromBalance = newTransaction.FromBalance.ToByteArray(),
                ToBalance = newTransaction.ToBalance.ToByteArray(),
                Amount = newTransaction.Amount.ToByteArray(),
                AssetId = asset.Id,
                Time = newTransaction.TimeStamp.FromTimestampMS(),
            };
            _db.Nep5Transactions.Add(tran);
            UpdateBalance(from, asset, newTransaction.FromBalance);
            UpdateBalance(to, asset, newTransaction.ToBalance);
        }

        public void UpdateBalance(AddressEntity address, AssetEntity asset, BigInteger balance)
        {
            if (address == null) return;
            var old = _db.AssetBalances.FirstOrDefault(a => a.AddressId == address.Id && a.AssetId == asset.Id);
            if (old == null)
            {
                _db.AssetBalances.Add(new AssetBalanceEntity()
                { AddressId = address.Id, AssetId = asset.Id, Balance = balance.ToByteArray() });
            }
            else
            {
                old.Balance = balance.ToByteArray();
            }
        }

        public AddressEntity GetOrCreateAddress(UInt160 address)
        {
            if (address == null) return null;
            var addr = address.ToHexString();
            var old = _db.Addresses.FirstOrDefault(a => a.Address == addr);
            if (old == null)
            {
                old = new AddressEntity() { Hash = address.ToArray(), Address = addr };
                _db.Addresses.Add(old);
                _db.SaveChanges();
            }
            return old;
        }

        public AssetEntity GetOrCreateAsset(UInt160 asset)
        {
            var assetStr = asset.ToHexString();
            var old = _db.Assets.FirstOrDefault(a => a.Asset == assetStr);
            if (old == null)
            {
                old = new AssetEntity() { Hash = asset.ToArray(), Asset = assetStr };
                _db.Assets.Add(old);
                _db.SaveChanges();
            }
            return old;
        }


        public PageList<TransferInfo> FindTransfer(TrackFilter filter)
        {
            IQueryable<Nep5TransactionEntity> query = _db.Nep5Transactions
                .Include(t => t.From)
                .Include(t => t.To)
                .Include(t => t.Asset);

            if (filter.FromOrTo.NotEmpty())
            {
                var addresses = filter.FromOrTo.Select(a => a.ToHexString()).ToList();
                query = query.Where(r => addresses.Contains(r.From.Address) || addresses.Contains(r.To.Address));
            }
            if (filter.From.NotEmpty())
            {
                var addresses = filter.From.Select(a => a.ToHexString()).ToList();
                query = query.Where(r => addresses.Contains(r.From.Address));
            }
            if (filter.To.NotEmpty())
            {
                var addresses = filter.To.Select(a => a.ToHexString()).ToList();
                query = query.Where(r => addresses.Contains(r.To.Address));
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
                query = query.Where(r => r.Asset.Asset == filter.AssetId.ToHexString());
            }
            if (filter.BlockHeight != null)
            {
                query = query.Where(r => r.BlockHeight == filter.BlockHeight);
            }
            if (filter.TxId != null)
            {
                query = query.Where(r => r.TxId == filter.TxId.ToHexString());
            }

            var pageList = new PageList<TransferInfo>();
            if (filter.PageIndex.HasValue)
            {
                var pageIndex = filter.PageIndex <= 0 ? 0 : filter.PageIndex.Value - 1;
                pageList.TotalCount = query.Count();
                pageList.PageIndex = pageIndex + 1;
                pageList.PageSize = filter.PageSize;
                if (filter.PageSize > 0)
                {
                    pageList.List.AddRange(query.OrderByDescending(r => r.Time).Skip(pageIndex * filter.PageSize)
                        .Take(filter.PageSize).ToList().Select(ToNep5TransferInfo));
                }
            }
            else
            {
                pageList.List.AddRange(query.OrderByDescending(r => r.Time).ToList().Select(ToNep5TransferInfo));
                pageList.TotalCount = pageList.List.Count;
            }
            return pageList;
        }



        private TransferInfo ToNep5TransferInfo(Nep5TransactionEntity entity)
        {
            return new TransferInfo()
            {
                BlockHeight = entity.BlockHeight,
                TxId = UInt256.Parse(entity.TxId),
                From = entity.From != null ? UInt160.Parse(entity.From.Address) : null,
                To = UInt160.Parse(entity.To.Address),
                FromBalance = new BigInteger(entity.FromBalance),
                ToBalance = new BigInteger(entity.ToBalance),
                Amount = new BigInteger(entity.Amount),
                AssetId = UInt160.Parse(entity.Asset.Asset),

                TimeStamp = entity.Time.AsUtcTime().ToTimestampMS(),
            };
        }

        public void Dispose()
        {
            _db?.Dispose();
        }
    }
}
