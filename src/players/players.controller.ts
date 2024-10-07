import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  Param
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@ApiTags('users') // Tag to group related endpoints
@Controller('players')
export class PlayersController {
  constructor(
  private readonly playerService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users List.', type: [Player] })
  async findAll(): Promise<Player[]> {
    return await this.playerService.getAllUsers();
  }

  @Get('/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User Email' })
  @ApiResponse({ status: 200, description: 'User Found.', type: Player })
  @ApiResponse({ status: 404, description: 'User not Found.' })
  findOne(@Param('email') email: string){
    return this.playerService.getByEmail(email);
  }


  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({ status: 201, description: 'User created.', type: Player })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  async create(
    @Body() createUserDto: CreatePlayerDto,
  ): Promise<Partial<Player>> {
    return await this.playerService.create(createUserDto);
  }

  @Patch('update/')

  async update(
    @Body('email') email: string,
    @Body() UpdatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return await this.playerService.update(email, UpdatePlayerDto);
  }


  @Delete('')

  remove(@Body('email') email: string): Promise<string>{
    return this.playerService.remove(email);
  }

}

