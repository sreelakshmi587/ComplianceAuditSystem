using AuditManagement.Data;
using AuditManagement.DTOs;
using AuditManagement.Models;
using AuditManagement.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context,
                            JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
               // Group = "Super Admin"
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return Ok("User created");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(x => x.Email == request.Email);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            try
            {
                bool validPassword = BCrypt.Net.BCrypt.Verify(
                    request.Password,
                    user.PasswordHash);

                if (!validPassword)
                {
                    return Unauthorized("Invalid credentials");
                }

                var token =
                        _jwtService.GenerateToken(user);

                return Ok(new
                {
                    token,
                    username = user.Username,
                    email = user.Email
                });
            }
            catch (BCrypt.Net.SaltParseException ex)
            {
                Console.WriteLine($"Invalid password hash: {ex.Message}");

                return BadRequest("Stored password hash is invalid.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");

                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
                    ForgotPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
            {
                return NotFound("User not found");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.NewPassword);

            await _context.SaveChangesAsync();

            return Ok("Password updated successfully");
        }
    }
}
