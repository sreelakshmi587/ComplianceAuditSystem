using AuditManagement.Data;
using AuditManagement.DTOs;
using AuditManagement.Helpers.constants;
using AuditManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var totalPermissions =
                await _context.Permissions.CountAsync();

            var users = await _context.Users
                .Include(x => x.Group)
                .OrderBy(x => x.Username)
                .ToListAsync();

            var result = users.Select(user =>
            {
                var assignedCount =
                    _context.UserPermissions.Count(x =>
                        x.UserId == user.Id);

                return new UserResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,

                    GroupId = user.GroupId,
                    GroupName = user.Group.Name,

                    Permission =
                        assignedCount == totalPermissions
                        ? $"Full Access ({assignedCount}/{totalPermissions})"
                        : $"Partial Access ({assignedCount}/{totalPermissions})"
                };
            });

            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users
                .Include(x => x.Group)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound();

            var totalPermissions =
                await _context.Permissions.CountAsync();

            var assignedCount =
                await _context.UserPermissions
                    .CountAsync(x => x.UserId == id);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,

                GroupId = user.GroupId,
                GroupName = user.Group.Name,

                Permission =
                    assignedCount == totalPermissions
                    ? $"Full Access ({assignedCount}/{totalPermissions})"
                    : $"Partial Access ({assignedCount}/{totalPermissions})"
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(
    UserRequest request)
        {
            var group = await _context.Groups
                .FirstOrDefaultAsync(x =>
                    x.Id == request.GroupId);

            if (group == null)
                return BadRequest("Group not found");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        Constants.userPassword),

                GroupId = request.GroupId
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            var groupPermissionIds =
                await _context.GroupPermissions
                    .Where(x =>
                        x.GroupId == request.GroupId)
                    .Select(x =>
                        x.PermissionId)
                    .ToListAsync();

            var userPermissions =
                groupPermissionIds.Select(permissionId =>
                    new UserPermission
                    {
                        UserId = user.Id,
                        PermissionId = permissionId
                    });

            await _context.UserPermissions
                .AddRangeAsync(userPermissions);

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
    Guid id,
    UserRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound();

            var group = await _context.Groups
                .FirstOrDefaultAsync(x =>
                    x.Id == request.GroupId);

            if (group == null)
                return BadRequest("Group not found");

            bool groupChanged =
                user.GroupId != request.GroupId;

            user.Username = request.Username;
            user.Email = request.Email;
            user.GroupId = request.GroupId;

            if (groupChanged)
            {
                var existingPermissions =
                    await _context.UserPermissions
                        .Where(x => x.UserId == id)
                        .ToListAsync();

                _context.UserPermissions.RemoveRange(
                    existingPermissions);

                var groupPermissionIds =
                    await _context.GroupPermissions
                        .Where(x =>
                            x.GroupId == request.GroupId)
                        .Select(x =>
                            x.PermissionId)
                        .ToListAsync();

                await _context.UserPermissions
                    .AddRangeAsync(
                        groupPermissionIds.Select(
                            permissionId =>
                                new UserPermission
                                {
                                    UserId = id,
                                    PermissionId = permissionId
                                }));
            }

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(
          Guid id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound();

            var permissions =
                await _context.UserPermissions
                    .Where(x => x.UserId == id)
                    .ToListAsync();

            _context.UserPermissions.RemoveRange(
                permissions);

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok("User deleted successfully");
        }

    }
}
