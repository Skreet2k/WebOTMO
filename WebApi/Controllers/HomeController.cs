using Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class HomeController : Controller
    {
        public JsonResult Index()
        {
            return Json("Hello Word");
        }
    }
}
