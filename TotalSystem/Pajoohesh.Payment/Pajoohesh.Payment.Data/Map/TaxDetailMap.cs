using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class TaxDetailMap : EntityTypeConfiguration<TaxDetail>
	{
		public TaxDetailMap()
		{
			ToTable("PAYT2_TaxDetail", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT2_TaxDetail_Pkey");

			Property(x => x.PAYT1_TaxHeader_Pkey).HasColumnName("PAYT1_TaxHeader_Pkey");
			Property(x => x.Fromvalue).HasColumnName("PAYT2_TaxDetail_Fromvalue");
			Property(x => x.Tovalue).HasColumnName("PAYT2_TaxDetail_Tovalue");
			Property(x => x.TaxPercent).HasColumnName("PAYT2_TaxDetail_TaxPercent");
			Property(x => x.AccumulatedTax).HasColumnName("PAYT2_TaxDetail_AccumulatedTax");
			Property(x => x.Radif).HasColumnName("PAYT2_TaxDetail_Radif");
		}
	}
}
