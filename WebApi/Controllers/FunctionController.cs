using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApi.Dtos;
using WebApi.Services;

namespace WebApi.Controllers {
    [Authorize]
    [Route ("[controller]")]
    public class FunctionController : Controller {
        private readonly IFunctionService _functionService;
        private readonly IFlowService _flowService;

        public FunctionController (IFunctionService functionService, IFlowService flowService) {
            _functionService = functionService;
            _flowService = flowService;
        }

        [HttpGet ("get")]
        public IActionResult Get () {
            return Ok (_functionService.GetFunctions ());
        }

        [HttpPost ("processFunction")]
        public IActionResult ProcessFunction([FromBody]FunctionDto function) {

            var flow = _flowService.GetFlowWithData(function.flowId);
            var data = JsonConvert.DeserializeObject<List<double>>(flow.Data);

            var result = _functionService.ProcessFunction (
                function.Id, data, function.numberOfServiceUnits ?? 1, function.loadFactor ?? 0.1, function.maxLoadFactor ?? 1);
            return Ok(result);
        }
    }
}