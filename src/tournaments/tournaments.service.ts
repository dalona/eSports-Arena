// src/tournaments/tournaments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PlayersService } from 'src/players/players.service';
import { Match } from 'src/matches/entities/match.entity';

@Injectable()
export class TournamentsService {
  matchesRepository: any;
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    private playersService: PlayersService,
  ) {}

  // Method for generating matches
async generateRandomMatches(tournamentId: number): Promise<Match[]> {
  const tournament = await this.tournamentsRepository.findOne({
    where:{ id: tournamentId }, //Using an object with the 'where' property to search by ID
    relations: ['players'], // Loads relationship Players
  });

  if (!tournament) {
    throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
  }

  const players = tournament.players;
  if (players.length < 2) {
    throw new Error('Not enough players to generate matches');
  }

  // Shuffle players randomly
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());

  const matches: Match[] = [];
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (shuffledPlayers[i + 1]) {
      const match = new Match();
      match.tournament = tournament;
      match.player1 = shuffledPlayers[i];
      match.player2 = shuffledPlayers[i + 1];
      matches.push(match);
    }
  }

  return this.matchesRepository.save(matches);
}

  create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create(createTournamentDto);
    return this.tournamentsRepository.save(tournament);
  }

  findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({ relations: ['players', 'matches'] });
  }

  findOne(id: number): Promise<Tournament> {
    return this.tournamentsRepository.findOne({
      where: { id }, // Using an object with the 'where' property to search by ID
      relations: ['players', 'matches'], // Loading relationships
    });
  }
  

  async update(id: number, updateTournamentDto: UpdateTournamentDto): Promise<Tournament> {
    const tournamentExists = await this.tournamentsRepository.findOne({ where: { id } });
  
    if (!tournamentExists) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
  
    await this.tournamentsRepository.update(id, updateTournamentDto);
    return this.tournamentsRepository.findOne({ where: { id } });
  }
  

  async remove(id: number): Promise<void> {
    const result = await this.tournamentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
  }

  async addPlayer(tournamentId: number, player: any): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({ 
      where: { id: tournamentId }, // Uses 'where' to search by ID
      relations: ['players'],}) // Loads the relation 'players'
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentId} not found`);
    }
    tournament.players.push(player);
    return this.tournamentsRepository.save(tournament);
  }
}
