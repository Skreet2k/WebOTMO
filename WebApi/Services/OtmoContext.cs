using Microsoft.EntityFrameworkCore;
using WebApi.Entities;

namespace Services
{
    public class OtmoContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Flow> Flows { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=mssql5.gear.host;Initial Catalog=otmo;User ID=otmo;Password=Ff2L566M0~-i;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("User");
            modelBuilder.Entity<Flow>()
                .ToTable("Flow");
        }
    }
}