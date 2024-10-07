import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Player } from 'src/players/entities/player.entity';
import { PlayersService } from 'src/players/players.service';
import { PlayersModule } from 'src/players/players.module';

@Module({
    imports:[ConfigModule ,TypeOrmModule.forFeature([Player]), 
    PlayersModule,
      PassportModule.register({defaultStrategy:'jwt'}),
      JwtModule.registerAsync({
        imports:[ConfigModule],
        useFactory:(configService:ConfigService)=>{      
          return {
            secret:configService.get('JWT_SECRET'),
            signOptions:{expiresIn:'2h'}
        }},
        inject:[ConfigService],
      }),
      
    ],
    controllers: [AuthController],
    providers: [AuthService, PlayersService, JwtStrategy],
    exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
  })
  export class AuthModule {}
