using System;
using Pajoohesh.Framework.Domain.Entity;

namespace Pajoohesh.Payment.Domain.Entity
{
	public partial class TaxDetail : BaseEntity<int>
	{
		public int PAYT1_TaxHeader_Pkey { get; set; }
		public decimal Fromvalue { get; set; }
		public decimal Tovalue { get; set; }
		public float TaxPercent { get; set; }
		public decimal AccumulatedTax { get; set; }
		public int Radif { get; set; }
	}
}
