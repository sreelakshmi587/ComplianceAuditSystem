namespace AuditManagement.Models
{
    public class Permission
    {
        public Guid Id { get; set; }

        public int ModuleId { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public string? Description { get; set; }

        public PermissionModule Module { get; set; }
    }
}
