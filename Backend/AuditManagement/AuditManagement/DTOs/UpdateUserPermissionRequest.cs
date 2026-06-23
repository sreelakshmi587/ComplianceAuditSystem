namespace AuditManagement.DTOs
{
    public class UpdateUserPermissionsRequest
    {
        public List<Guid> PermissionIds { get; set; } = [];
    }
}
