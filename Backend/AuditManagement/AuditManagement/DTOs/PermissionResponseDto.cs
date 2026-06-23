namespace AuditManagement.DTOs
{
    public class PermissionResponseDto
    {
        public Guid PermissionId { get; set; }

        public string Name { get; set; }

        public bool IsAssigned { get; set; }
    }
}
