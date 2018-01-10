using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("get/{id}")]
        public IActionResult Get(long id)
        {
            return Ok(_flowService.GetFlow(id));
        }
        
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody]FlowWithDataDto flow)
        {
            var result = await _flowService.Upload(flow);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody]FlowWithDataDto flow)
        {
            var result = await _flowService.Update(flow);
            return Ok(result);
        }

        [HttpPut("getfunction/{flowId}/{functionId}/")]
        public async Task<IActionResult> GetFunction([FromBody]FlowWithDataDto flow)
        {
            var result = await _flowService.Update(flow);
            return Ok(result);
        }
    }
}