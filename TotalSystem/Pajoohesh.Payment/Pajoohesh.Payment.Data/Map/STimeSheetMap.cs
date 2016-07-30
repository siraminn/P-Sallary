using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class STimeSheetMap : EntityTypeConfiguration<STimeSheet>
	{
		public STimeSheetMap()
		{
			ToTable("PAYT20_STimeSheet", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT20_STimeSheet_PKey");

			Property(x => x.EMPT1_Employees_Pkey).HasColumnName("EMPT1_Employees_Pkey");
			Property(x => x.Year).HasColumnName("PAYT20_STimeSheet_Year");
			Property(x => x.Month).HasColumnName("PAYT20_STimeSheet_Month");
		}
	}
}
