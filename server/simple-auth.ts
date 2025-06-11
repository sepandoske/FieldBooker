import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'secure-football-booking-system-2024';

// Simple in-memory user store for now (in production, use database)
const adminUser = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('123456', 10), // Default password: 123456
  role: 'admin'
};

export async function loginUser(username: string, password: string) {
  if (username === adminUser.username && bcrypt.compareSync(password, adminUser.password)) {
    const token = jwt.sign(
      { userId: adminUser.id, username: adminUser.username, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return { user: adminUser, token };
  }
  return null;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'غير مخول للوصول' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'رمز الوصول غير صالح' });
    }
    (req as any).user = user;
    next();
  });
}

export function getCurrentUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}