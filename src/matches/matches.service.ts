// src/matches/matches.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { TournamentsService } from '../tournaments/tournaments.service';
import { PlayersService } from '../players/players.service';
import { CreateResultDto } from 'src/results/dto/create-result.dto';
import { Result } from 'src/results/entities/result.entity';

@Injectable()
export class MatchesService {


  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private tournamentsService: TournamentsService,
    private playersService: PlayersService,
  ) {}

  async generateRandomMatches(tournamentId: number): Promise<Match[]> {
    const tournament = await this.tournamentsService.findOne(tournamentId);
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }

    const players = tournament.players;
    if (players.length < 2) {
      throw new BadRequestException('Not enough players to generate matches');
    }

    // Randomly mix players
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());

    const matches: Match[] = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) {
        const match = this.matchesRepository.create({
          tournament: tournament,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
        });
        matches.push(match);
      }
    }

    return this.matchesRepository.save(matches);
  }

  async addResult(matchId: number, createResultDto: CreateResultDto): Promise<Match> {
    const match = await this.matchesRepository.findOne({ where : { id: matchId }, relations: ['result'],});
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }
  
    if (match.result) {
      throw new BadRequestException('Result already recorded for this match');
    }
  
    const winner = await this.playersService.findOne(createResultDto.winnerId);
    const loser = await this.playersService.findOne(createResultDto.loserId);
  
    if (!winner || !loser) {
      throw new NotFoundException('Winner or Loser not found');
    }
  
    const result = new Result();
    result.winner = winner;
    result.loser = loser;
    result.winnerScore = createResultDto.winnerScore;
    result.loserScore = createResultDto.loserScore;
  
    match.result = result;
    return this.matchesRepository.save(match);
  }
  
  async getResultsByTournament(
    tournamentId: number,
    score?: number,
    order: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const query = this.matchesRepository.createQueryBuilder('match')
      .leftJoinAndSelect('match.result', 'result')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .where('match.tournament = :tournamentId', { tournamentId });
  
    if (score !== undefined) {
      query.andWhere('(result.winnerScore >= :score OR result.loserScore >= :score)', { score });
    }
  
    query.orderBy('result.winnerScore', order.toUpperCase() as 'ASC' | 'DESC');
  
    // Pagination
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);
  
    const [matches, total] = await query.getManyAndCount();
  
    return {
      data: matches,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }


}
