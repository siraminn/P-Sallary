using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class STimeSheetDTO
	{
		public Guid EMPT1_Employees_Pkey { get; set; }
		public int Year { get; set; }
		public int Month { get; set; }
	}

	public class STimeSheetQuery : Query<STimeSheetQueryResult>
	{
		public int PKey { get; set; }
		public Guid EMPT1_Employees_Pkey { get; set; }
		public int Year { get; set; }
		public int Month { get; set; }
	}

	public class STimeSheetQueryResult : ListQueryResult<STimeSheetDTO> { }
	public class STimeSheetResult : Result { }
}
