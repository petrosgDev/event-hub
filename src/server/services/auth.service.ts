import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        studentId: data.studentId,
        interests: data.interests || [],
        universityId: data.universityId,
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        department: true,
        interests: true,
        streakCount: true,
        badges: true,
        universityId: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        department: true,
        interests: true,
        streakCount: true,
        badges: true,
        universityId: true,
        isActive: true,
        hasPaidWorkspace: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(token: string) {
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.deleteMany({
          where: { userId: storedToken.userId },
        });
      }
      throw new UnauthorizedError('Refresh token expired or revoked');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const tokens = await this.generateTokens(decoded.userId);
    return tokens;
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        department: true,
        bio: true,
        phone: true,
        studentId: true,
        interests: true,
        streakCount: true,
        badges: true,
        universityId: true,
        isVerified: true,
        hasPaidWorkspace: true,
        createdAt: true,
        university: {
          select: { id: true, name: true, slug: true, logo: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();

