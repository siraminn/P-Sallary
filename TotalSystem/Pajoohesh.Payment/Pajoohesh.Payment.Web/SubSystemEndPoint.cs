using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Pajoohesh.Payment.Web
{
    public class SubSystemEndPoint
    {
        public static readonly string Inf = ConfigurationManager.AppSettings["inf"];
        public static readonly string Base = ConfigurationManager.AppSettings["base"];
        public static readonly string Rec = ConfigurationManager.AppSettings["rec"];
        public static readonly string Emp = ConfigurationManager.AppSettings["emp"];
        public static readonly string USM = ConfigurationManager.AppSettings["userManagement"];
    }
}