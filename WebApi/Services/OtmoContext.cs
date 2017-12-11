using Microsoft.EntityFrameworkCore;
using WebApi.Entities;

namespace Services
{
    public class OtmoContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Flow> Flows { get; set; }

        public DbSet<Function> Functions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=SQL6002.site4now.net;Initial Catalog=DB_A2EBA2_otmo;User ID=DB_A2EBA2_otmo_admin;Password=Qqwerty1!;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Flow>().ToTable("Flow");
            modelBuilder.Entity<Function>().ToTable("Function");
        }
    }
}