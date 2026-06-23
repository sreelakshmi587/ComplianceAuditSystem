namespace AuditManagement.DTOs
{
    public class BulkPermissionRequest
    {
        public int ModuleId { get; set; }

        public List<string> Permissions { get; set; }
    }
}
