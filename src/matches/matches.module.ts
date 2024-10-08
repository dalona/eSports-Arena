import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from 'src/players/players.module';
import { Match } from './entities/match.entity';
import { TournamentsModule } from 'src/tournaments/tournaments.module';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { PlayersService } from 'src/players/players.service';
import { Result } from 'src/results/entities/result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match,Result]),
    PlayersModule,TournamentsModule
  ],
  controllers: [MatchesController],
  providers: [MatchesService, TournamentsService, PlayersService],
})
export class MatchesModule {}
