import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  // GET /api/v1/watchlist
  @Get()
  getWatchlist(@Req() req: any) {
    return this.watchlistService.getWatchlist(req.user.id);
  }

  // GET /api/v1/watchlist/check/:movieId
  @Get('check/:movieId')
  checkInWatchlist(
    @Req() req: any,
    @Param('movieId') movieId: number,
  ) {
    return this.watchlistService.checkInWatchlist(
      req.user.id,
      Number(movieId),
    );
  }

  // POST /api/v1/watchlist
  @Post()
  add(@Req() req: any, @Body() dto: AddWatchlistDto) {
    return this.watchlistService.add(req.user.id, dto);
  }

  // DELETE /api/v1/watchlist/:movieId
  @Delete(':movieId')
  remove(@Req() req: any, @Param('movieId') movieId: number) {
    return this.watchlistService.remove(req.user.id, Number(movieId));
  }
}