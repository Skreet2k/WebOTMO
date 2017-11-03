using Microsoft.AspNetCore.Http;

namespace WebApi.Services
{
    public interface IIdentityService{
        long GetUserId();
    }
    public class IdentityService: IIdentityService
    {
        private readonly IHttpContextAccessor _context;
        public IdentityService(IHttpContextAccessor context)
        {
            _context = context;

        }

        public long GetUserId()
        {
            long.TryParse(_context.HttpContext.User.Identity.Name, out var userId);
            return userId;
        }
    }
}