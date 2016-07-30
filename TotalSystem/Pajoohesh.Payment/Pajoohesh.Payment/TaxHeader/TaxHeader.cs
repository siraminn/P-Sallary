using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class TaxHeaderDTO
	{
		public int PkeyReference { get; set; }
		public int DateChange { get; set; }
		public bool Active { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public int Code { get; set; }
		public string Desc { get; set; }
	}

	public class TaxHeaderQuery : Query<TaxHeaderQueryResult>
	{
		public int Pkey { get; set; }
		public int PkeyReference { get; set; }
		public int DateChange { get; set; }
		public bool Active { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public int Code { get; set; }
		public string Desc { get; set; }
	}

	public class TaxHeaderQueryResult : ListQueryResult<TaxHeaderDTO> { }
	public class TaxHeaderResult : Result { }
}
