import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { loginUserDto } from './dto/login.dto';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private readonly userRepository: Repository<Player>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: loginUserDto) {
    const { password, email } = loginDto;

    console.log('Attempting login for email:', email);

    try {
      const player = await this.userRepository.createQueryBuilder('player')
        .where('player.email = :email', { email })
        .select(['player.name', 'player.email', 'player.password', 'player.role'])
        .getOne();

      if (!player) {
        console.error('Player not found:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('Player found:', player.email);

      const isPasswordValid = await this.validatePassword(password, player.password);
      if (!isPasswordValid) {
        console.error('Invalid password for Player:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateJwtToken({ email: player.email });
      console.log('Token generated for player:', email);

      return this.buildLoginResponse(player, token);
    } catch (error) {
      console.error('Error during login process:', error);
      throw error;
    }
  }

  private async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  private generateJwtToken(payload: JwtPayload): string {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  private buildLoginResponse(player: Player, token: string) {
    console.log('Building login response for player:', player.email);
    return {
      name: player.username,
      email: player.email,
      role: player.role,
      token: token,
    };
  }
}
