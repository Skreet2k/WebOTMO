using System.Collections.Generic;
using System.Linq;
using Services;
using WebApi.Dtos;
using AutoMapper.QueryableExtensions;
using System.Threading.Tasks;
using AutoMapper;
using WebApi.Entities;

namespace WebApi.Services
{
    public interface IFlowService
    {
        IEnumerable<FlowDto> GetFlows();
        Task<FlowDto> Upload(FlowWithDataDto flowDto);
    }
    public class FlowService : IFlowService
    {
        private OtmoContext _context;
        private IIdentityService _identityService;
         private IMapper _mapper;

        public FlowService(IIdentityService identityService, IMapper mapper)
        {
            _context = new OtmoContext();
            _identityService = identityService;
            _mapper = mapper;
        }
        public IEnumerable<FlowDto> GetFlows()
        {
            var userId = _identityService.GetUserId();
            return _context.Flows.Where(x => !x.UserId.HasValue || x.UserId == userId).ProjectTo<FlowDto>();
        }

        public async Task<FlowDto> Upload(FlowWithDataDto flowDto)
        {
            var flow = _mapper.Map<Flow>(flowDto);
           _context.Flows.Add(flow);
           await _context.SaveChangesAsync();

           return _mapper.Map<FlowDto>(flow);
        }
    }
}