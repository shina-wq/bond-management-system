import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);

      // Check if user is active
      if (!user.is_active) {
        throw new UnauthorizedException('Account is inactive');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.usersService.updateLastLogin(user.id);

      // Return user without password
      const { password_hash, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.user_roles.name,
      permissions: user.user_roles.permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.employees.email,
        firstName: user.employees.first_name,
        lastName: user.employees.last_name,
        role: user.user_roles.name,
        permissions: user.user_roles.permissions,
      },
    };
  }

  // Validate token
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
