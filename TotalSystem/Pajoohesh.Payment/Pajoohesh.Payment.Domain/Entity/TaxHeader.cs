using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class TaxHeader : BaseEntity<int>
	{
		public int PkeyReference { get; set; }
		public int DateChange { get; set; }
		public bool Active { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public int Code { get; set; }
		public string Desc { get; set; }
	}
}
