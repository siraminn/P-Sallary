using System.Web.Http;
using Pajoohesh.UserManagement.Queries;
using Pajoohesh.Framework.Web;
using Pajoohesh.UserManagement.AgentContract;

namespace Pajoohesh.UserManagement.Web.Controllers
{
    public class LogUserChangeActiveQueryController : ApiBaseController
    {
        private readonly ILogUserChangeActiveAgent _logUserChangeActiveAgent;
        public LogUserChangeActiveQueryController(ILogUserChangeActiveAgent logUserChangeActiveAgent)
        {
            _logUserChangeActiveAgent = logUserChangeActiveAgent;
        }

        [AcceptVerbs("GET", "POST")]
        public GetLogUserChangeActiveQueryResult GetUserActiveChange(GetLogUserChangeActiveQuery getLogUserChangeActiveQueryParam)
        {
            return _logUserChangeActiveAgent.GetLogUserChangeActive(getLogUserChangeActiveQueryParam);
        }
    }
}