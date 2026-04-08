import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // GET /api/v1/profiles/me
  @Get('me')
  getProfile(@Req() req: any) {
    return this.profilesService.getProfile(req.user.id);
  }

  // GET /api/v1/profiles/me/stats
  @Get('me/stats')
  getStats(@Req() req: any) {
    return this.profilesService.getProfileStats(req.user.id);
  }

  // GET /api/v1/profiles/me/reviews
  @Get('me/reviews')
  getReviews(@Req() req: any) {
    return this.profilesService.getReviewHistory(req.user.id);
  }

  // PATCH /api/v1/profiles/me
  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.user.id, dto);
  }
}