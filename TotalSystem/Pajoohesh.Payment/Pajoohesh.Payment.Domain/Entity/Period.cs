using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class Period : BaseEntity<Guid>
	{
		public int Year { get; set; }
		public int Month { get; set; }
		public Guid ORGT1_OrgUnits_Pkey { get; set; }
		public Guid EmploymentStatus { get; set; }
		public int TimesheetStatus { get; set; }
		public int PayrollStatus { get; set; }
		public string MessagesMonths { get; set; }
	}
}
