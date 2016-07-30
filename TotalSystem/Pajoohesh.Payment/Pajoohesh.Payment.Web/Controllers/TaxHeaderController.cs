//using System;
//using Pajoohesh.Framework.Web;
//using System.Web.Http;
//using Pajoohesh.Payment.BusinessServiceContract;

//namespace Pajoohesh.Payment.Web.Controllers
//{
//    public class TaxHeaderController : ApiBaseController
//    {
//        private readonly ITaxHeaderService _agent = null;

//        public TaxHeaderController(ITaxHeaderService agent)
//        {
//            _agent = agent;
//        }

//        [HttpGet]
//        public string salam()
//        {
//            _agent.Create(new TaxHeaderDTO()
//            {
//                Active = true,
//                DateChange = 2,
//                EndDate = DateTime.Now.AddDays(3),
//                Code = 66,
//                Desc = "hasdfasdfa6d54a6d54a6d54a6d54ads654as65d4as65d4asdio",
//                PkeyReference = 1,
//                StartDate = DateTime.Now
//            });
//            /*_agent.Delete(
//                new TaxHeaderQuery()
//                {
//                    Pkey = 1,
//                    Active = true,
//                    DateChange = 2,
//                    EndDate = DateTime.Now.AddDays(3),
//                    Code = 66,
//                    Desc = "hasdfasdfa6d54a6d54a6d54a6d54ads654as65d4as65d4asdio",
//                    PkeyReference = 1,
//                    StartDate = DateTime.Now

//                });*/
//            return "Test";
//        }
//    }
//}