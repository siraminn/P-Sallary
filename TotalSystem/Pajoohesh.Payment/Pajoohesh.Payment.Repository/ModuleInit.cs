using System;
using System.ComponentModel.Composition;
using System.Configuration;
using Pajoohesh.Framework.Data;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Framework.Hosting;
using Pajoohesh.Payment.Data;
using Pajoohesh.Payment.Domain;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Framework.InversionOfControl;
using Pajoohesh.Framework;

namespace Pajoohesh.Payment.Repository
{
    [Export(typeof(IModule))]
    public class ModuleInit : IModule
    {
        public string Name { get; set; }
        public void Initialize(ITotalSystemContainer registrar)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["Payment"].ConnectionString;
            DbContextConfigProvider.Instance.Add(new DbContextConfig(connectionString, typeof(PaymentDbContext)));

            registrar.Register<EfSqlQuery<PaymentDbContext, IPaymentSqlContext>, ISqlQuery<IPaymentSqlContext>>();
            
            registrar.Register<BaseRepository<TaxHeader, int, PaymentDbContext>, IRepository<TaxHeader, int>>();
            registrar.Register<BaseRepository<TaxDetail, int, PaymentDbContext>, IRepository<TaxDetail, int>>();
            registrar.Register<BaseRepository<STimeSheet, int, PaymentDbContext>, IRepository<STimeSheet, int>>();
            registrar.Register<BaseRepository<Workshop, int, PaymentDbContext>, IRepository<Workshop, int>>();
            registrar.Register<BaseRepository<Formula, Guid, PaymentDbContext>, IRepository<Formula, Guid>>();
            registrar.Register<BaseRepository<Period, Guid, PaymentDbContext>, IRepository<Period, Guid>>();
        }
    }
}