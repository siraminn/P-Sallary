namespace Pajoohesh.Payment.BusinessServiceContract
{
	public interface IFormulaService
	{
		FormulaQueryResult Get(FormulaQuery message);
		FormulaResult Create(FormulaDTO message);
		FormulaResult Update(FormulaQuery message);
		FormulaResult Delete(FormulaQuery message);
	}
}
