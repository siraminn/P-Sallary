using Pajoohesh.Framework.Hosting;
using Pajoohesh.Framework.InversionOfControl;
using Pajoohesh.Payment.BusinessServiceContract;
using System.ComponentModel.Composition;

namespace Pajoohesh.Payment.BusinessService
{
    [Export(typeof(IModule))]
    public class ModuleInit : IModule
    {
        public string Name { get; set; }
        public void Initialize(ITotalSystemContainer registrar)
        {
            registrar.Register<TaxHeaderService, ITaxHeaderService>();
            registrar.Register<TaxDetailService, ITaxDetailService>();
            registrar.Register<STimeSheetService, ISTimeSheetService>();
            registrar.Register<WorkshopService, IWorkshopService>();
            registrar.Register<FormulaService, IFormulaService>();
            registrar.Register<PeriodService, IPeriodService>();
        }
    }
}
