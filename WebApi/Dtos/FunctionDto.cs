namespace WebApi.Dtos
{
    public class FunctionDto
    {
        public long Id { get; set; }
        public long flowId { get; set; }
        public int? numberOfServiceUnits { get; set; }
        public double? loadFactor { get; set; }
    }
}