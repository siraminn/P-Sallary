using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class TaxHeaderMap : EntityTypeConfiguration<TaxHeader>
	{
		public TaxHeaderMap()
		{
			ToTable("PAYT1_TaxHeader", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT1_TaxHeader_Pkey");

			Property(x => x.PkeyReference).HasColumnName("PAYT1_TaxHeader_PkeyReference");
			Property(x => x.DateChange).HasColumnName("PAYT1_TaxHeader_DateChange");
			Property(x => x.Active).HasColumnName("PAYT1_TaxHeader_Active");
			Property(x => x.StartDate).HasColumnName("PAYT1_TaxHeader_StartDate");
			Property(x => x.EndDate).HasColumnName("PAYT1_TaxHeader_EndDate");
			Property(x => x.Code).HasColumnName("PAYT1_TaxHeader_Code");
			Property(x => x.Desc).HasColumnName("PAYT1_TaxHeader_Desc");
		}
	}
}
