namespace AuditManagement.DTOs
{
    public class UserRequest
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public Guid GroupId { get; set; }
    }
}
