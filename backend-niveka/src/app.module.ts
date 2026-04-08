import { Module } from '@nestjs/common';
import { AuthModule }      from './modules/auth/auth.module';
import { ReviewsModule }   from './modules/reviews/reviews.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';

@Module({
  imports: [
    AuthModule,
    ReviewsModule,
    WatchlistModule
  ],
})
export class AppModule {}