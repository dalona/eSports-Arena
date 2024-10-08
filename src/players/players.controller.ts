import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  Param,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/enums/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Players') // Tag to group related endpoints
@Controller('players')

export class PlayersController {
  constructor(
  private readonly playerService: PlayersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update user by email' })
  async update(
    @Body('email') email: string,
    @Body() UpdatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return await this.playerService.update(email, UpdatePlayerDto);
  }


  @Delete()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user by email' })
  remove(@Body('email') email: string): Promise<string>{
    return this.playerService.remove(email);
  }

}

