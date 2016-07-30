using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class WorkshopService : IWorkshopService
	{
		private IUnitOfWorkFactory UnitOfWorkFactory;

		public WorkshopService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public WorkshopQueryResult Get(WorkshopQuery message)
		{
			var result = new WorkshopQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<Workshop, int>().Get().Select(x => new WorkshopDTO()
				{
					NO = x.NO,
					Name = x.Name,
					Employer = x.Employer,
					Address = x.Address,
					ListNo = x.ListNo,
					ListDesc = x.ListDesc,
					ContractNO = x.ContractNO,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public WorkshopResult Create(WorkshopDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new Workshop()
				{
					NO = message.NO,
					Name = message.Name,
					Employer = message.Employer,
					Address = message.Address,
					ListNo = message.ListNo,
					ListDesc = message.ListDesc,
					ContractNO = message.ContractNO,
				};
				database.Repository<Workshop, int>().Add(model);
				database.SaveChanges();
			}
			return new WorkshopResult()
			{
				Success = true
			};
		}

		public WorkshopResult Update(WorkshopQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Workshop = database.Repository<Workshop, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				_Workshop.NO = message.NO;
				_Workshop.Name = message.Name;
				_Workshop.Employer = message.Employer;
				_Workshop.Address = message.Address;
				_Workshop.ListNo = message.ListNo;
				_Workshop.ListDesc = message.ListDesc;
				_Workshop.ContractNO = message.ContractNO;
				database.Repository<Workshop, int>().Update(_Workshop);
				database.SaveChanges();
			}
			return new WorkshopResult()
			{
				Success = true
			};
		}

		public WorkshopResult Delete(WorkshopQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Workshop = database.Repository<Workshop, int>().Get(x => x.Key == message.Pkey).FirstOrDefault();
				database.Repository<Workshop, int>().Delete(_Workshop);
				database.SaveChanges();
			}
			return new WorkshopResult()
			{
				Success = true
			};
		}
	}
}
