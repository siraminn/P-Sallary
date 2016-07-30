using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class FormulaMap : EntityTypeConfiguration<Formula>
	{
		public FormulaMap()
		{
			ToTable("PAYT4_Formula", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT4_Formula_PKey");

			Property(x => x.PkeyReference).HasColumnName("PAYT4_Formula_PkeyReference");
			Property(x => x.DateChange).HasColumnName("PAYT4_Formula_DateChange");
			Property(x => x.Active).HasColumnName("PAYT4_Formula_Active");
			Property(x => x.Name).HasColumnName("PAYT4_Formula_Name");
			Property(x => x.Script).HasColumnName("PAYT4_Formula_Script");
			Property(x => x.Structure).HasColumnName("PAYT4_Formula_Structure");
			Property(x => x.EmploymentStatus).HasColumnName("PAYT4_Formula_EmploymentStatus");
		}
	}
}
