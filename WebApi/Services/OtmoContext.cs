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
            optionsBuilder.UseSqlServer(@"Data Source=localhost;Initial Catalog=OTMO;Trusted_Connection=True;");
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