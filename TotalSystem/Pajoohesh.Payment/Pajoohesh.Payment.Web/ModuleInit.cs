using Pajoohesh.Framework.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;
using Pajoohesh.Framework.InversionOfControl;
using Pajoohesh.Framework;

namespace Pajoohesh.Payment.Web
{
    [Export(typeof(IModule))]
    public class ModuleInit : IModule
    {
        public string Name { get; set; }

        public void Initialize(ITotalSystemContainer container)
        {
        }
    }
}