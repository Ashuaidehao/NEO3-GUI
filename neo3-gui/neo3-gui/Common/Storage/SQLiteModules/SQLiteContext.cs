﻿using System;
using System.Linq;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Neo.Common.Storage.SQLiteModules
{
    public class SQLiteContext : DbContext
    {

        private static readonly object _lockObject = new object();
        private static byte[] _dbId;
        private readonly string _filename;

        /// <summary>
        /// db file unique identification 
        /// </summary>
        public byte[] Identity => _dbId;


        public DbSet<IdentityEntity> Identities { get; set; }
        public DbSet<SyncIndex> SyncIndexes { get; set; }
        public DbSet<Nep5TransactionEntity> Nep5Transactions { get; set; }
        public DbSet<AssetEntity> Assets { get; set; }
        public DbSet<AssetBalanceEntity> AssetBalances { get; set; }
        public DbSet<AddressEntity> Addresses { get; set; }
        public DbSet<TransactionEntity> Transactions { get; set; }


        public SQLiteContext(string filename)
        {
            this._filename = filename;
            Database.EnsureCreated();
            InitDbIdentity();
        }


        private void InitDbIdentity()
        {
            if (_dbId == null)
            {
                lock (_lockObject)
                {
                    if (_dbId == null)
                    {
                        var identity = Identities.FirstOrDefault();
                        if (identity == null)
                        {
                            var guid = Guid.NewGuid().ToByteArray();
                            identity = new IdentityEntity() { Data = guid };
                            Identities.Add(identity);
                            SaveChanges();
                        }
                        _dbId = identity.Data;
                        Console.WriteLine($"SQLite ID:{_dbId.ToHexString()}");
                    }
                }
            }
        }

        public uint? GetMaxSyncIndex()
        {
            try
            {
                return SyncIndexes.OrderBy(s => s.BlockHeight).LastOrDefault()?.BlockHeight;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            SqliteConnectionStringBuilder sb = new SqliteConnectionStringBuilder
            {
                DataSource = _filename
            };
            optionsBuilder.UseSqlite(sb.ToString());
        }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Nep5TransactionEntity>().HasIndex(p => p.FromId);
            modelBuilder.Entity<Nep5TransactionEntity>().HasIndex(p => p.ToId);
            modelBuilder.Entity<Nep5TransactionEntity>().HasIndex(p => p.Time);
            modelBuilder.Entity<Nep5TransactionEntity>().HasIndex(p => p.TxId);

            modelBuilder.Entity<AddressEntity>().HasIndex(p => p.Address);

            modelBuilder.Entity<AssetBalanceEntity>().HasIndex(p => new { p.AddressId, p.AssetId });


            //modelBuilder.Entity<SyncIndex>().HasIndex(p => p.BlockHeight);
            modelBuilder.Entity<TransactionEntity>().HasIndex(p => p.BlockHeight);
        }
    }
}
