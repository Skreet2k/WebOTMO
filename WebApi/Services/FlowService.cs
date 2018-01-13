using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Services;
using WebApi.Dtos;
using WebApi.Entities;

namespace WebApi.Services {
    public interface IFlowService {
        IEnumerable<FlowDto> GetFlows ();
        FlowDto GetFlow (long id);
        FlowWithDataDto GetFlowWithData (long id);
        Task<FlowDto> Upload (FlowWithDataDto flowDto);
        Task<FlowDto> Update (FlowWithDataDto flowDto);
        void Delete(long id);
    }

    public class FlowService : IFlowService {
        private OtmoContext _context;
        private IIdentityService _identityService;
        private IMapper _mapper;

        public FlowService (IIdentityService identityService, IMapper mapper) {
            _context = new OtmoContext ();
            _identityService = identityService;
            _mapper = mapper;
        }

        public FlowDto GetFlow (long id) {
            return _mapper.Map<FlowDto> (_context.Flows.Find (id));
        }

        public FlowWithDataDto GetFlowWithData (long id) {
            return _mapper.Map<FlowWithDataDto> (_context.Flows.Find (id));
        }

        public IEnumerable<FlowDto> GetFlows () {
            var userId = _identityService.GetUserId ();
            return _context.Flows.Where (x => !x.UserId.HasValue || x.UserId == userId).ProjectTo<FlowDto> ();
        }

        public async Task<FlowDto> Update (FlowWithDataDto flowDto) {
            var flow = _context.Flows.Find (flowDto.Id);

            flow.Name = flowDto.Name;

            if (!string.IsNullOrEmpty (flowDto.Data)) {
                flow.Data = flowDto.Data;
            }
            await _context.SaveChangesAsync ();

            return _mapper.Map<FlowDto> (flow);
        }

        public async Task<FlowDto> Upload (FlowWithDataDto flowDto) {
            var userId = _identityService.GetUserId ();
            var flow = _mapper.Map<Flow> (flowDto);
            flow.UserId = userId;
            _context.Flows.Add (flow);
            await _context.SaveChangesAsync ();

            return _mapper.Map<FlowDto> (flow);
        }

        public async void Delete(long id) {
            var flow = _context.Flows.Find (id);
            _context.Flows.Remove (flow);
            await _context.SaveChangesAsync ();
        }
    }
}