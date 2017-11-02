using Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public JsonResult Index()
        {
            return Json("Hello Word");
        }
    }
}
