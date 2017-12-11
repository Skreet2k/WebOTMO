using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApi.Dtos;
using WebApi.Services;

namespace WebApi.Controllers {
    [Authorize]
    [Route ("[controller]")]
    public class FunctionController : Controller {
        public FunctionController (IFunctionService functionService, IFlowService flowService) {
            _functionService = functionService;
            _flowService = flowService;
        }

        [HttpGet ("get")]
        public IActionResult Get () {
            return Ok (_functionService.Get ());
        }

        [HttpGet ("processFunction")]
        public IActionResult ProcessFunction (long functionId, long flowId, int numFlow = 1, double loadFactor = 0.1) {

            var flow = _flowService.GetFlowWithData (flowId);
            var data = JsonConvert.DeserializeObject<List<double>> (flow.Data);

            return Ok (_functionService.ProcessFunction (functionId, data, numFlow, loadFactor));
        }

        private readonly IFunctionService _functionService;
        private readonly IFlowService _flowService;
    }
}