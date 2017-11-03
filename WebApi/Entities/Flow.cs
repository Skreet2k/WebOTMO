namespace WebApi.Entities
{
    public class Flow
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Data { get; set; }
        public long? UserId { get; set; }
    }
}