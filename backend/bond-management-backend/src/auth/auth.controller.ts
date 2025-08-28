import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    // The user will be attached to the request by the AuthGuard
    return this.authService.login(body.user);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() body: { token: string }) {
    try {
      const decoded = this.authService.validateToken(body.token);
      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false };
    }
  }
}
