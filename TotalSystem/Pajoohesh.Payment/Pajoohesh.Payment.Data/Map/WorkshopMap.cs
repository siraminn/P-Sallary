using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class WorkshopMap : EntityTypeConfiguration<Workshop>
	{
		public WorkshopMap()
		{
			ToTable("PAYT3_Workshop", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT3_Workshop_Pkey");

			Property(x => x.NO).HasColumnName("PAYT3_Workshop_NO");
			Property(x => x.Name).HasColumnName("PAYT3_Workshop_Name");
			Property(x => x.Employer).HasColumnName("PAYT3_Workshop_Employer");
			Property(x => x.Address).HasColumnName("PAYT3_Workshop_Address");
			Property(x => x.ListNo).HasColumnName("PAYT3_Workshop_ListNo");
			Property(x => x.ListDesc).HasColumnName("PAYT3_Workshop_ListDesc");
			Property(x => x.ContractNO).HasColumnName("PAYT3_Workshop_ContractNO");
		}
	}
}
