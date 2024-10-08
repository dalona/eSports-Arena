// src/tournaments/tournaments.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Patch, NotFoundException } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { PlayersService } from '../players/players.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly playersService: PlayersService,
  ) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  findAll(): Promise<Tournament[]> {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Tournament> {
    return this.tournamentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.tournamentsService.remove(id);
  }

  @Patch(':id/players/:playerId')
  async addPlayer(
    @Param('id') id: number,
    @Param('playerId') playerId: number,
  ): Promise<Tournament> {
    const player = await this.playersService.findOne(playerId);
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }
    return this.tournamentsService.addPlayer(id, player);
  }
  
}
