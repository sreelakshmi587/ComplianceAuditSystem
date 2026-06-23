using System.Security;

namespace AuditManagement.Models
{
    public class PermissionModule
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<Permission> Permissions { get; set; }
    }
}
