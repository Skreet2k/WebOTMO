using System.Collections.Generic;
using WebApi.Entities;

namespace WebApi.Services {
    public interface IFunctionService
    {
        List<double> ProcessFunction(long functionId, List<double> flow, int numFlow, double loadFactor);
        List<Function> Get();
    }
}