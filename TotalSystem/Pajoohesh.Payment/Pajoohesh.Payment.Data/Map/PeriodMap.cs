using System.Data.Entity.ModelConfiguration;
using Pajoohesh.Payment.Domain.Entity;

namespace Pajoohesh.Payment.Data.Map
{
	public class PeriodMap : EntityTypeConfiguration<Period>
	{
		public PeriodMap()
		{
			ToTable("PAYT5_Period", "PAY");
			HasKey(x => x.Key);
			Property(x => x.Key).HasColumnName("PAYT5_Period_Pkey");

			Property(x => x.Year).HasColumnName("PAYT5_Period_Year");
			Property(x => x.Month).HasColumnName("PAYT5_Period_Month");
			Property(x => x.ORGT1_OrgUnits_Pkey).HasColumnName("ORGT1_OrgUnits_Pkey");
			Property(x => x.EmploymentStatus).HasColumnName("PAYT5_Period_EmploymentStatus");
			Property(x => x.TimesheetStatus).HasColumnName("PAYT5_Period_TimesheetStatus");
			Property(x => x.PayrollStatus).HasColumnName("PAYT5_Period_PayrollStatus");
			Property(x => x.MessagesMonths).HasColumnName("PAYT5_Period_MessagesMonths");
		}
	}
}
