using Pajoohesh.Framework.Hosting;
using Pajoohesh.Framework.InversionOfControl;
using System.ComponentModel.Composition;

namespace Pajoohesh.Payment
{
    [Export(typeof(IModule))]
    public class ModuleInit : IModule
    {
        public string Name { get; set; }
        public void Initialize(ITotalSystemContainer registrar)
        {
        }
    }
}
