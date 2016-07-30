using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class Formula : BaseEntity<Guid>
	{
		public Guid PkeyReference { get; set; }
		public DateTime DateChange { get; set; }
		public bool Active { get; set; }
		public string Name { get; set; }
		public string Script { get; set; }
		public string Structure { get; set; }
		public Guid EmploymentStatus { get; set; }
	}
}
