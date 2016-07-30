namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface IPeriodService
	{
		PeriodQueryResult Get(PeriodQuery message);
		PeriodResult Create(PeriodDTO message);
		PeriodResult Update(PeriodQuery message);
		PeriodResult Delete(PeriodQuery message);
	}
}
