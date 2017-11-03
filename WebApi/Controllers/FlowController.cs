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
    public class FlowController : Controller
    {
        private readonly IFlowService _flowService;
        public FlowController(IFlowService flowService)
        {
            _flowService = flowService;
        }
        [HttpGet("get")]
        public IActionResult Get()
        {
            return Ok(_flowService.GetFlows());
        }
        
        [HttpPut("upload")]
        public async Task<IActionResult> Upload([FromBody]FlowWithDataDto flow)
        {
            var result = await _flowService.Upload(flow);
            return Ok(result);
        }
    }
}