using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class PeriodService : IPeriodService
	{
		private IUnitOfWorkFactory UnitOfWorkFactory;

		public PeriodService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public PeriodQueryResult Get(PeriodQuery message)
		{
			var result = new PeriodQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<Period, Guid>().Get().Select(x => new PeriodDTO()
				{
					Year = x.Year,
					Month = x.Month,
					ORGT1_OrgUnits_Pkey = x.ORGT1_OrgUnits_Pkey,
					EmploymentStatus = x.EmploymentStatus,
					TimesheetStatus = x.TimesheetStatus,
					PayrollStatus = x.PayrollStatus,
					MessagesMonths = x.MessagesMonths,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public PeriodResult Create(PeriodDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new Period()
				{
					Year = message.Year,
					Month = message.Month,
					ORGT1_OrgUnits_Pkey = message.ORGT1_OrgUnits_Pkey,
					EmploymentStatus = message.EmploymentStatus,
					TimesheetStatus = message.TimesheetStatus,
					PayrollStatus = message.PayrollStatus,
					MessagesMonths = message.MessagesMonths,
				};
				database.Repository<Period, Guid>().Add(model);
				database.SaveChanges();
			}
			return new PeriodResult()
			{
				Success = true
			};
		}

		public PeriodResult Update(PeriodQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Period = database.Repository<Period, Guid>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				_Period.Year = message.Year;
				_Period.Month = message.Month;
				_Period.ORGT1_OrgUnits_Pkey = message.ORGT1_OrgUnits_Pkey;
				_Period.EmploymentStatus = message.EmploymentStatus;
				_Period.TimesheetStatus = message.TimesheetStatus;
				_Period.PayrollStatus = message.PayrollStatus;
				_Period.MessagesMonths = message.MessagesMonths;
				database.Repository<Period, Guid>().Update(_Period);
				database.SaveChanges();
			}
			return new PeriodResult()
			{
				Success = true
			};
		}

		public PeriodResult Delete(PeriodQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Period = database.Repository<Period, Guid>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				database.Repository<Period, Guid>().Delete(_Period);
				database.SaveChanges();
			}
			return new PeriodResult()
			{
				Success = true
			};
		}
	}
}
