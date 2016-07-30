using System;
using System.Linq;
using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain.Entity;
using Pajoohesh.Payment.BusinessServiceContract;

namespace Pajoohesh.Payment.BusinessService
{
	public class FormulaService : IFormulaService
	{
        private IUnitOfWorkFactory UnitOfWorkFactory;

		public FormulaService(IUnitOfWorkFactory unitOfWorkFactory)
		{
			UnitOfWorkFactory = unitOfWorkFactory;
		}

		public FormulaQueryResult Get(FormulaQuery message)
		{
			var result = new FormulaQueryResult();
			using (var database = UnitOfWorkFactory.Create())
			{
				var query = database.Repository<Formula, Guid>().Get().Select(x => new FormulaDTO()
				{
					PkeyReference = x.PkeyReference,
					DateChange = x.DateChange,
					Active = x.Active,
					Name = x.Name,
					Script = x.Script,
					Structure = x.Structure,
					EmploymentStatus = x.EmploymentStatus,
				}).ToList();
				result.Entities = query;
				return result;
			}
		}

		public FormulaResult Create(FormulaDTO message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var model = new Formula()
				{
					PkeyReference = message.PkeyReference,
					DateChange = message.DateChange,
					Active = message.Active,
					Name = message.Name,
					Script = message.Script,
					Structure = message.Structure,
					EmploymentStatus = message.EmploymentStatus,
				};
				database.Repository<Formula, Guid>().Add(model);
				database.SaveChanges();
			}
			return new FormulaResult()
			{
				Success = true
			};
		}

		public FormulaResult Update(FormulaQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Formula = database.Repository<Formula, Guid>().Get(x => x.Key == message.PKey).FirstOrDefault();
				_Formula.PkeyReference = message.PkeyReference;
				_Formula.DateChange = message.DateChange;
				_Formula.Active = message.Active;
				_Formula.Name = message.Name;
				_Formula.Script = message.Script;
				_Formula.Structure = message.Structure;
				_Formula.EmploymentStatus = message.EmploymentStatus;
				database.Repository<Formula, Guid>().Update(_Formula);
				database.SaveChanges();
			}
			return new FormulaResult()
			{
				Success = true
			};
		}

		public FormulaResult Delete(FormulaQuery message)
		{
			using (var database = UnitOfWorkFactory.Create())
			{
				var _Formula = database.Repository<Formula, Guid>().Get(x => x.Key == message.PKey).FirstOrDefault();
				database.Repository<Formula, Guid>().Delete(_Formula);
				database.SaveChanges();
			}
			return new FormulaResult()
			{
				Success = true
			};
		}
	}
}
