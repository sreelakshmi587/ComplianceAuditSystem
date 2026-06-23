namespace AuditManagement.DTOs
{
    public class ModulePermissionResponseDto
    {
        public int ModuleId { get; set; }

        public string ModuleName { get; set; }

        public List<PermissionResponseDto> Permissions { get; set; }
    }
}
