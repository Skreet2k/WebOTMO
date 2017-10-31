using Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    public class UserController : Controller
    {
        public UserController(){
            _userServices = new UserServices();
        }
        public async Task<StatusCodeResult> Register(string email, string password)
        {
            await _userServices.Register(email,password);
            return Ok();
        }

        public async Task<ActionResult> Login(string email, string password)
        {
            var isLogin = await _userServices.Login(email,password);
            if(isLogin)
                return Ok();
            return Forbid();
        }

        private readonly UserServices _userServices;
    }
}
