using AuditManagement.Data;
using AuditManagement.DTOs;
using AuditManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GroupsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetGroups()
        {
            var groups = await _context.Groups
                .OrderBy(x => x.Name)
                .ToListAsync();

            return Ok(groups);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroup(Guid id)
        {
            var group = await _context.Groups
                .FirstOrDefaultAsync(x => x.Id == id);

            if (group == null)
                return NotFound();

            return Ok(group);
        }
        [HttpPost]
        public async Task<IActionResult> AddGroup(
            GroupRequest request)
        {
            var group = new Group
            {
                Name = request.Name,
                Description = request.Description
            };

            _context.Groups.Add(group);

            await _context.SaveChangesAsync();

            return Ok(group);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(
            Guid id,
            GroupRequest request)
        {
            var group = await _context.Groups
                .FirstOrDefaultAsync(x => x.Id == id);

            if (group == null)
                return NotFound();

            group.Name = request.Name;
            group.Description = request.Description;

            await _context.SaveChangesAsync();

            return Ok(group);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(
            Guid id)
        {
            var group = await _context.Groups
                .FirstOrDefaultAsync(x => x.Id == id);

            if (group == null)
                return NotFound();

            _context.Groups.Remove(group);

            await _context.SaveChangesAsync();

            return Ok("Group deleted successfully");
        }
    }
}
