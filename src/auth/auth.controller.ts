import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });
    return { accessToken: tokens.access_token };
  }
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    // const tokens = await this.authService. (refreshToken);
    const tokens = this.jwtService.verify(refreshToken);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
