using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class TaxDetailService : ITaxDetailService
	{
		private IUnitOfWorkFactory UnitOfWorkFactory;

		public TaxDetailService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public TaxDetailQueryResult Get(TaxDetailQuery message)
		{
			var result = new TaxDetailQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<TaxDetail, int>().Get().Select(x => new TaxDetailDTO()
				{
					PAYT1_TaxHeader_Pkey = x.PAYT1_TaxHeader_Pkey,
					Fromvalue = x.Fromvalue,
					Tovalue = x.Tovalue,
					TaxPercent = x.TaxPercent,
					AccumulatedTax = x.AccumulatedTax,
					Radif = x.Radif,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public TaxDetailResult Create(TaxDetailDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new TaxDetail()
				{
					PAYT1_TaxHeader_Pkey = message.PAYT1_TaxHeader_Pkey,
					Fromvalue = message.Fromvalue,
					Tovalue = message.Tovalue,
					TaxPercent = message.TaxPercent,
					AccumulatedTax = message.AccumulatedTax,
					Radif = message.Radif,
				};
				database.Repository<TaxDetail, int>().Add(model);
				database.SaveChanges();
			}
			return new TaxDetailResult()
			{
				Success = true
			};
		}

		public TaxDetailResult Update(TaxDetailQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _TaxDetail = database.Repository<TaxDetail, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				_TaxDetail.PAYT1_TaxHeader_Pkey = message.PAYT1_TaxHeader_Pkey;
				_TaxDetail.Fromvalue = message.Fromvalue;
				_TaxDetail.Tovalue = message.Tovalue;
				_TaxDetail.TaxPercent = message.TaxPercent;
				_TaxDetail.AccumulatedTax = message.AccumulatedTax;
				_TaxDetail.Radif = message.Radif;
				database.Repository<TaxDetail, int>().Update(_TaxDetail);
				database.SaveChanges();
			}
			return new TaxDetailResult()
			{
				Success = true
			};
		}

		public TaxDetailResult Delete(TaxDetailQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _TaxDetail = database.Repository<TaxDetail, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				database.Repository<TaxDetail, int>().Delete(_TaxDetail);
				database.SaveChanges();
			}
			return new TaxDetailResult()
			{
				Success = true
			};
		}
	}
}
