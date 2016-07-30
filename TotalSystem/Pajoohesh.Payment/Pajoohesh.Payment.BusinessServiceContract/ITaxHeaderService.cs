namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface ITaxHeaderService
	{
		TaxHeaderQueryResult Get(TaxHeaderQuery message);
		TaxHeaderResult Create(TaxHeaderDTO message);
		TaxHeaderResult Update(TaxHeaderQuery message);
		TaxHeaderResult Delete(TaxHeaderQuery message);
	}
}
