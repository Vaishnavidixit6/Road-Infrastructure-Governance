// lib/auth.js
import bcrypt from 'bcryptjs';

// In a real application, you would store this in a database
// For demo purposes, we're using a hardcoded admin user
const adminUser = {
  id: 1,
  username: 'admin',
  // Password is "admin123" hashed
  password: '$2a$10$8K1p/a0dRaP6qBo5W5T1f.L3/.a6QqS0QO7E3x7NlDpGpVdNqyY1K'
};

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function login(username, password) {
  if (username === adminUser.username) {
    const isValid = await verifyPassword(password, adminUser.password);
    if (isValid) {
      // Return user data without password
      const { password: _, ...userWithoutPassword } = adminUser;
      return userWithoutPassword;
    }
  }
  return null;
}