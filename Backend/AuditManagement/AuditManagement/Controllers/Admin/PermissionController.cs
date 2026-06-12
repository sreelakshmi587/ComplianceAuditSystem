using AuditManagement.Data;
using AuditManagement.DTOs;
using AuditManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace AuditManagement.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PermissionsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("modules")]
        public async Task<IActionResult> GetModules()
        {
            var modules = await _context.PermissionModules
                .ToListAsync();

            return Ok(modules);
        }

        [HttpPost]
        public async Task<IActionResult> AddPermission(
            CreatePermissionRequest request)
        {
            try
            {
                var module = await _context.PermissionModules
                .FirstOrDefaultAsync(x => x.Id == request.ModuleId);

                if (module == null)
                {
                    return BadRequest("Module not found");
                }

                var permission = new Permission
                {
                    ModuleId = request.ModuleId,
                    Name = request.Name,

                    Code = $"{module.Name.ToUpper()}_{request.Name.Replace(" ", "_").ToUpper()}"
                };

                _context.Permissions.Add(permission);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Permission added successfully",
                    PermissionId = permission.Id
                });
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(
                  StatusCodes.Status500InternalServerError,
                  ex.Message);
                        }
            
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> AddPermissionsBulk(
            BulkPermissionRequest request)
        {
            var module = await _context.PermissionModules
                .FirstOrDefaultAsync(x => x.Id == request.ModuleId);

            if (module == null)
            {
                return BadRequest();
            }

            foreach (var permissionName in request.Permissions)
            {
                bool exists = await _context.Permissions
                    .AnyAsync(x =>
                        x.ModuleId == request.ModuleId &&
                        x.Name == permissionName);

                if (!exists)
                {
                    _context.Permissions.Add(new Permission
                    {
                        ModuleId = request.ModuleId,
                        Name = permissionName,
                        Code =
                            $"{module.Name.ToUpper()}_{permissionName.Replace(" ", "_").ToUpper()}"
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("module/{moduleId}")]
        public async Task<IActionResult> GetPermissionsByModule(
            int moduleId)
        {
            var permissions = await _context.Permissions
                .Where(x => x.ModuleId == moduleId)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return Ok(permissions);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(
            int id,
            UpdatePermissionRequest request)
        {
            var permission = await _context.Permissions
                .FindAsync(id);

            if (permission == null)
                return NotFound();

            permission.Name = request.Name;

            await _context.SaveChangesAsync();

            return Ok(permission);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(
            int id)
        {
            var permission =
                await _context.Permissions.FindAsync(id);

            if (permission == null)
                return NotFound();

            _context.Permissions.Remove(permission);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("modules-with-permissions")]
        public async Task<IActionResult> GetModulesWithPermissions()
        {
            var modules = await _context.PermissionModules
                .Include(x => x.Permissions)
                .Select(x => new
                {
                    moduleId = x.Id,
                    moduleName = x.Name,
                    permissions = x.Permissions.Select(p => new
                    {
                        id = p.Id,
                        name = p.Name
                    })
                })
                .ToListAsync();

            return Ok(modules);
        }

        //[HttpGet("groups/{groupId}/permissions")]
        //public async Task<IActionResult> GetGroupPermissions(
        //    Guid groupId)
        //{
        //    var permissions = await _context.GroupPermissions
        //        .Where(x => x.GroupId == groupId)
        //        .Select(x => x.PermissionId)
        //        .ToListAsync();

        //    return Ok(permissions);
        //} 

        [HttpGet("{groupId}/permissions")]
        public async Task<IActionResult> GetGroupPermissions(Guid groupId)
        {
            var assignedPermissionIds = await _context.GroupPermissions
                .Where(x => x.GroupId == groupId)
                .Select(x => x.PermissionId)
                .ToListAsync();

            var modules = await _context.PermissionModules
                .Include(x => x.Permissions)
                .OrderBy(x => x.Name)
                .ToListAsync();

            var result = modules.Select(module =>
                new ModulePermissionResponseDto
                {
                    ModuleId = module.Id,
                    ModuleName = module.Name,

                    Permissions = module.Permissions
                        .Select(permission =>
                            new PermissionResponseDto
                            {
                                PermissionId = permission.Id,
                                Name = permission.Name,
                                IsAssigned =
                                    assignedPermissionIds.Contains(permission.Id)
                            })
                        .ToList()
                });

            return Ok(result);
        }

        [HttpPut("{groupId}/permissions")]
        public async Task<IActionResult> UpdateGroupPermissions(
            Guid groupId,
            UpdateGroupPermissionsRequest request)
        {
            var existingPermissions =
                await _context.GroupPermissions
                    .Where(x => x.GroupId == groupId)
                    .ToListAsync();

            _context.GroupPermissions.RemoveRange(
                existingPermissions);

            var newPermissions =
                request.PermissionIds.Select(permissionId =>
                    new GroupPermission
                    {
                        GroupId = groupId,
                        PermissionId = permissionId
                    });

            await _context.GroupPermissions.AddRangeAsync(
                newPermissions);

            await _context.SaveChangesAsync();

            return Ok("Permissions updated successfully");
        }
    }
}
