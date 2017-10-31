using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using System;
using System.Linq;

namespace Services
{
    public class UserServices : IDisposable
    {
        public UserServices()
        {
            _context = new OtmoContext();
        }
        public async Task Register(string email, string password)
        {
            var sha1 = SHA1.Create();
            var salt = Guid.NewGuid().ToByteArray();
            var passwordAndSalt = salt.Concat(Encoding.UTF8.GetBytes(password)).ToArray();
            var passwordHash = sha1.ComputeHash(passwordAndSalt);

            var user = new User { Email = email, Password = passwordHash, Salt = salt };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> Login(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x=> x.Email == email);

            var sha1 = SHA1.Create();
            var salt = user.Salt;
            var passwordAndSalt = salt.Concat(Encoding.UTF8.GetBytes(password)).ToArray();
            var passwordHash = sha1.ComputeHash(passwordAndSalt);
            return user.Password.SequenceEqual(passwordHash);
        }

        private readonly OtmoContext _context;

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                _context.Dispose();

                disposedValue = true;
            }
        }
        void IDisposable.Dispose()
        {
            Dispose(true);
        }
        #endregion

    }
}