using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class WorkshopDTO
	{
		public string NO { get; set; }
		public string Name { get; set; }
		public string Employer { get; set; }
		public string Address { get; set; }
		public string ListNo { get; set; }
		public string ListDesc { get; set; }
		public string ContractNO { get; set; }
	}

	public class WorkshopQuery : Query<WorkshopQueryResult>
	{
		public int Pkey { get; set; }
		public string NO { get; set; }
		public string Name { get; set; }
		public string Employer { get; set; }
		public string Address { get; set; }
		public string ListNo { get; set; }
		public string ListDesc { get; set; }
		public string ContractNO { get; set; }
	}

	public class WorkshopQueryResult : ListQueryResult<WorkshopDTO> { }
	public class WorkshopResult : Result { }
}
