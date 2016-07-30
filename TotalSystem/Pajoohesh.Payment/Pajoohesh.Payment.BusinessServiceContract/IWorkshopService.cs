namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface IWorkshopService
	{
		WorkshopQueryResult Get(WorkshopQuery message);
		WorkshopResult Create(WorkshopDTO message);
		WorkshopResult Update(WorkshopQuery message);
		WorkshopResult Delete(WorkshopQuery message);
	}
}
