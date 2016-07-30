using System;
using Pajoohesh.Framework;
using Pajoohesh.Framework.Queries;

namespace Pajoohesh.Payment
{
	public class FormulaDTO
	{
		public Guid PkeyReference { get; set; }
		public DateTime DateChange { get; set; }
		public bool Active { get; set; }
		public string Name { get; set; }
		public string Script { get; set; }
		public string Structure { get; set; }
		public Guid EmploymentStatus { get; set; }
	}

	public class FormulaQuery : Query<FormulaQueryResult>
	{
		public Guid PKey { get; set; }
		public Guid PkeyReference { get; set; }
		public DateTime DateChange { get; set; }
		public bool Active { get; set; }
		public string Name { get; set; }
		public string Script { get; set; }
		public string Structure { get; set; }
		public Guid EmploymentStatus { get; set; }
	}

	public class FormulaQueryResult : ListQueryResult<FormulaDTO> { }
	public class FormulaResult : Result { }
}
