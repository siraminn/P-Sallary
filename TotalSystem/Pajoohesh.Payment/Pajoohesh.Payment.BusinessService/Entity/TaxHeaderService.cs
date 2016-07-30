using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class TaxHeaderService : ITaxHeaderService
	{
		private IUnitOfWorkFactory UnitOfWorkFactory { get; set; }

		public TaxHeaderService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public TaxHeaderQueryResult Get(TaxHeaderQuery message)
		{
			var result = new TaxHeaderQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<TaxHeader, int>().Get().Select(x => new TaxHeaderDTO()
				{
					PkeyReference = x.PkeyReference,
					DateChange = x.DateChange,
					Active = x.Active,
					StartDate = x.StartDate,
					EndDate = x.EndDate,
					Code = x.Code,
					Desc = x.Desc,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public TaxHeaderResult Create(TaxHeaderDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new TaxHeader()
				{
					PkeyReference = message.PkeyReference,
					DateChange = message.DateChange,
					Active = message.Active,
					StartDate = message.StartDate,
					EndDate = message.EndDate,
					Code = message.Code,
					Desc = message.Desc,
				};
				database.Repository<TaxHeader, int>().Add(model);
				database.SaveChanges();
			}
			return new TaxHeaderResult()
			{
				Success = true
			};
		}

		public TaxHeaderResult Update(TaxHeaderQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _TaxHeader = database.Repository<TaxHeader, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				_TaxHeader.PkeyReference = message.PkeyReference;
				_TaxHeader.DateChange = message.DateChange;
				_TaxHeader.Active = message.Active;
				_TaxHeader.StartDate = message.StartDate;
				_TaxHeader.EndDate = message.EndDate;
				_TaxHeader.Code = message.Code;
				_TaxHeader.Desc = message.Desc;
				database.Repository<TaxHeader, int>().Update(_TaxHeader);
				database.SaveChanges();
			}
			return new TaxHeaderResult()
			{
				Success = true
			};
		}

		public TaxHeaderResult Delete(TaxHeaderQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _TaxHeader = database.Repository<TaxHeader, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				database.Repository<TaxHeader, int>().Delete(_TaxHeader);
				database.SaveChanges();
			}
			return new TaxHeaderResult()
			{
				Success = true
			};
		}
	}
}
