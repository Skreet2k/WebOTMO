namespace WebApi.Entities
{
    public partial class User
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
    }
}