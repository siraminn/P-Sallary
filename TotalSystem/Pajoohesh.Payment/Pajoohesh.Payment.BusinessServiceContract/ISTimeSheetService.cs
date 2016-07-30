namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface ISTimeSheetService
	{
		STimeSheetQueryResult Get(STimeSheetQuery message);
		STimeSheetResult Create(STimeSheetDTO message);
		STimeSheetResult Update(STimeSheetQuery message);
		STimeSheetResult Delete(STimeSheetQuery message);
	}
}
