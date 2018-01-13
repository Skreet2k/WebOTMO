namespace WebApi.Entities {
    public class Function {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double DeltaX { get; set; }
        public bool IsNeedMaxLoadFactor { get; set; }
    }
}