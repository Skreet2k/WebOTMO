using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class FunctionController : Controller
    {
        private readonly IFunctionService _functionService;
        public FunctionController(IFunctionService functionService)
        {
            _functionService = functionService;
        }
        [HttpGet("get")]
        public IActionResult Get()
        {
            return Ok(_functionService.Get());
        }
    }
}