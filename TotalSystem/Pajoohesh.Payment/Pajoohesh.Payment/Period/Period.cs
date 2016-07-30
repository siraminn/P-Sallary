using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class PeriodDTO
	{
		public int Year { get; set; }
		public int Month { get; set; }
		public Guid ORGT1_OrgUnits_Pkey { get; set; }
		public Guid EmploymentStatus { get; set; }
		public int TimesheetStatus { get; set; }
		public int PayrollStatus { get; set; }
		public string MessagesMonths { get; set; }
	}

	public class PeriodQuery : Query<PeriodQueryResult>
	{
		public Guid Pkey { get; set; }
		public int Year { get; set; }
		public int Month { get; set; }
		public Guid ORGT1_OrgUnits_Pkey { get; set; }
		public Guid EmploymentStatus { get; set; }
		public int TimesheetStatus { get; set; }
		public int PayrollStatus { get; set; }
		public string MessagesMonths { get; set; }
	}

	public class PeriodQueryResult : ListQueryResult<PeriodDTO> { }
	public class PeriodResult : Result { }
}
