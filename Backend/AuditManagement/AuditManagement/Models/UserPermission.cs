namespace AuditManagement.Models
{
    public class UserPermission
    {
        public Guid UserId { get; set; }

        public Guid PermissionId { get; set; }

        public User User { get; set; }

        public Permission Permission { get; set; }
    }
}
