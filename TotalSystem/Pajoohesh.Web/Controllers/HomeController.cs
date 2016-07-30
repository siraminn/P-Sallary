using System;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Linq;

namespace Pajoohesh.Web.Controllers
{
    public class HomeController : System.Web.Mvc.Controller
    {
        protected override void OnActionExecuting(System.Web.Mvc.ActionExecutingContext filterContext)
        {
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            base.OnActionExecuting(filterContext);
        }
        // GET: Home
        public System.Web.Mvc.ActionResult Index()
        {
            return View();
        }


        public System.Web.Mvc.ActionResult Login()
        {
            return View();
        }

    }

}