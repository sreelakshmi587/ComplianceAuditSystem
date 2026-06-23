namespace AuditManagement.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public Guid GroupId { get; set; }

        public Group Group { get; set; }
    }
}
