using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class TaxDetailDTO
	{
		public int PAYT1_TaxHeader_Pkey { get; set; }
		public decimal Fromvalue { get; set; }
		public decimal Tovalue { get; set; }
		public float TaxPercent { get; set; }
		public decimal AccumulatedTax { get; set; }
		public int Radif { get; set; }
	}

	public class TaxDetailQuery : Query<TaxDetailQueryResult>
	{
		public int Pkey { get; set; }
		public int PAYT1_TaxHeader_Pkey { get; set; }
		public decimal Fromvalue { get; set; }
		public decimal Tovalue { get; set; }
		public float TaxPercent { get; set; }
		public decimal AccumulatedTax { get; set; }
		public int Radif { get; set; }
	}

	public class TaxDetailQueryResult : ListQueryResult<TaxDetailDTO> { }
	public class TaxDetailResult : Result { }
}
