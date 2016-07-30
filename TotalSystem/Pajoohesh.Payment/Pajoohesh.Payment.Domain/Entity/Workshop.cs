using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class Workshop : BaseEntity<int>
	{
		public string NO { get; set; }
		public string Name { get; set; }
		public string Employer { get; set; }
		public string Address { get; set; }
		public string ListNo { get; set; }
		public string ListDesc { get; set; }
		public string ContractNO { get; set; }
	}
}
