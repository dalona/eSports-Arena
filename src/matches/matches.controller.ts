// src/matches/matches.controller.ts
import { Controller, Post, Param, Body, Query, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { CreateResultDto } from 'src/results/dto/create-result.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('/generate/:tournamentId')
  generateMatches(@Param('tournamentId') tournamentId: number): Promise<Match[]> {
    return this.matchesService.generateRandomMatches(tournamentId);
  }

  @Post(':matchId/result')
async addResult(
  @Param('matchId') matchId: number,
  @Body() createResultDto: CreateResultDto,
): Promise<Match> {
  return this.matchesService.addResult(matchId, createResultDto);
}

@Get('/tournament/:tournamentId')
async getResultsByTournament(
  @Param('tournamentId') tournamentId: number,
  @Query('score') score?: number,
  @Query('order') order: 'asc' | 'desc' = 'asc',
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
): Promise<any> {
  return this.matchesService.getResultsByTournament(tournamentId, score, order, page, limit);
}

}