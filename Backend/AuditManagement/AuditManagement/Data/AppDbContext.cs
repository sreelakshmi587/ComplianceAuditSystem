using AuditManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PermissionModule>().HasData(
                new PermissionModule { Id = 1, Name = "Dashboard" },
                new PermissionModule { Id = 2, Name = "Audits" },
                new PermissionModule { Id = 3, Name = "Recommendations" },
                new PermissionModule { Id = 4, Name = "Admin" },
                new PermissionModule { Id = 5, Name = "Settings" }
            );
            modelBuilder.Entity<GroupPermission>()
                .HasKey(x => new { x.GroupId, x.PermissionId });
            modelBuilder.Entity<UserPermission>()
                .HasKey(x => new
                {
                    x.UserId,
                    x.PermissionId
                });
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<PermissionModule> PermissionModules { get; set; }
        public DbSet<GroupPermission> GroupPermissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
    }
}
