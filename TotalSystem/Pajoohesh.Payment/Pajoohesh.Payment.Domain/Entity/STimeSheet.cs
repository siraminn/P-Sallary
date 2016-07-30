using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class STimeSheet : BaseEntity<int>
	{
		public Guid EMPT1_Employees_Pkey { get; set; }
		public int Year { get; set; }
		public int Month { get; set; }
	}
}
