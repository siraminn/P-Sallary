namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface ITaxDetailService
	{
		TaxDetailQueryResult Get(TaxDetailQuery message);
		TaxDetailResult Create(TaxDetailDTO message);
		TaxDetailResult Update(TaxDetailQuery message);
		TaxDetailResult Delete(TaxDetailQuery message);
	}
}
