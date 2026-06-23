namespace AuditManagement.DTOs
{
    public class UserResponseDto
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public Guid GroupId { get; set; }

        public string GroupName { get; set; }

        public string Permission { get; set; }
    }
}
