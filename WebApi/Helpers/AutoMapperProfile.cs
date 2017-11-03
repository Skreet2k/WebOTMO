using System.Text;
using AutoMapper;
using WebApi.Dtos;
using WebApi.Entities;
 
namespace WebApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>().ForMember(x=> x.Password, y=> y.MapFrom(z=> Encoding.UTF8.GetString(z.Password)));
            CreateMap<UserDto, User>().ForMember(x=> x.Password, y=> y.MapFrom(z=> Encoding.UTF8.GetBytes(z.Password)));
            CreateMap<Flow, FlowDto>();
            CreateMap<FlowWithDataDto, Flow>();
        }
    }
}