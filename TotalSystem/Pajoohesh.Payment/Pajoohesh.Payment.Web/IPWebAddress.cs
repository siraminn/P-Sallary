using System.Configuration;

namespace Pajoohesh.Payment.Web
{
    public static class IPWebAddress
    {
        public static string Inf = ConfigurationManager.AppSettings["inf"];
        public static string Base = ConfigurationManager.AppSettings["base"];
        public static string Emp = ConfigurationManager.AppSettings["emp"];
        public static string USM = ConfigurationManager.AppSettings["usm"];
    }
}