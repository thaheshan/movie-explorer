import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {

  // ── REGISTER ──────────────────────────────────────
  async register(dto: RegisterDto) {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: { username: dto.username },
      },
    });

    if (error) throw new BadRequestException(error.message);

    return {
      message: 'Registered successfully. Please check your email to confirm.',
      user: data.user,
    };
  }

  // ── LOGIN ─────────────────────────────────────────
  async login(dto: LoginDto) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new UnauthorizedException(error.message);

    return {
      message: 'Login successful 🎬',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
      },
    };
  }

  // ── LOGOUT ────────────────────────────────────────
  async logout(token: string) {
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) throw new BadRequestException(error.message);

    return { message: 'Logged out successfully' };
  }

  // ── RESET PASSWORD ────────────────────────────────
  async resetPassword(dto: ResetPasswordDto) {
    const { error } = await supabase.auth.resetPasswordForEmail(dto.email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) throw new BadRequestException(error.message);

    return { message: 'Password reset link sent to your email 📩' };
  }

  // ── UPDATE PASSWORD ───────────────────────────────
  async updatePassword(token: string, dto: UpdatePasswordDto) {
    // set session from token first
    const { error: sessionError } = await supabase.auth.getUser(token);

    if (sessionError) throw new UnauthorizedException('Invalid or expired token');

    const { error } = await supabase.auth.updateUser({
      password: dto.password,
    });

    if (error) throw new BadRequestException(error.message);

    return { message: 'Password updated successfully 🎉' };
  }

  // ── GET CURRENT USER ──────────────────────────────
  async getMe(token: string) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) throw new UnauthorizedException('Invalid token');

    return {
      id: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata?.username,
      created_at: data.user.created_at,
    };
  }
}