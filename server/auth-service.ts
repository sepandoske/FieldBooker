import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from './db';
import { users, sessions } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';
import type { User, LoginData, InsertUser } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();
    
    return user;
  }

  async login(loginData: LoginData): Promise<{ user: User; token: string; sessionId: string } | null> {
    const [user] = await db.select()
      .from(users)
      .where(and(
        eq(users.username, loginData.username),
        eq(users.isActive, true)
      ));

    if (!user || !await this.verifyPassword(loginData.password, user.password)) {
      return null;
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    
    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, sessionId, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token, sessionId };
  }

  async validateSession(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if session exists and is not expired
      const [session] = await db.select()
        .from(sessions)
        .where(and(
          eq(sessions.id, decoded.sessionId),
          gt(sessions.expiresAt, new Date())
        ));

      if (!session) {
        return null;
      }

      // Get user
      const [user] = await db.select()
        .from(users)
        .where(and(
          eq(users.id, session.userId),
          eq(users.isActive, true)
        ));

      return user || null;
    } catch (error) {
      return null;
    }
  }

  async logout(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async cleanExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(gt(new Date(), sessions.expiresAt));
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username));
    
    return user || null;
  }
}

export const authService = new AuthService();