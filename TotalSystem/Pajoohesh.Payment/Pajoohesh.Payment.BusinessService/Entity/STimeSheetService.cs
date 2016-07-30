using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class STimeSheetService : ISTimeSheetService
	{
		private IUnitOfWorkFactory UnitOfWorkFactory;

		public STimeSheetService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public STimeSheetQueryResult Get(STimeSheetQuery message)
		{
			var result = new STimeSheetQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<STimeSheet, int>().Get().Select(x => new STimeSheetDTO()
				{
					EMPT1_Employees_Pkey = x.EMPT1_Employees_Pkey,
					Year = x.Year,
					Month = x.Month,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public STimeSheetResult Create(STimeSheetDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new STimeSheet()
				{
					EMPT1_Employees_Pkey = message.EMPT1_Employees_Pkey,
					Year = message.Year,
					Month = message.Month,
				};
				database.Repository<STimeSheet, int>().Add(model);
				database.SaveChanges();
			}
			return new STimeSheetResult()
			{
				Success = true
			};
		}

		public STimeSheetResult Update(STimeSheetQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _STimeSheet = database.Repository<STimeSheet, int>().Get(x => x.Key == message.PKey).FirstOrDefault();
				_STimeSheet.EMPT1_Employees_Pkey = message.EMPT1_Employees_Pkey;
				_STimeSheet.Year = message.Year;
				_STimeSheet.Month = message.Month;
				database.Repository<STimeSheet, int>().Update(_STimeSheet);
				database.SaveChanges();
			}
			return new STimeSheetResult()
			{
				Success = true
			};
		}

		public STimeSheetResult Delete(STimeSheetQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _STimeSheet = database.Repository<STimeSheet, int>().Get(x => x.Key == message.PKey).FirstOrDefault();
				database.Repository<STimeSheet, int>().Delete(_STimeSheet);
				database.SaveChanges();
			}
			return new STimeSheetResult()
			{
				Success = true
			};
		}
	}
}
