import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly userRepository: Repository<Player>,
  ) {}

  async create(createUserDto: CreatePlayerDto): Promise<Partial<Player>> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
      
  
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        // role: Role.User,
      });
  
      await this.userRepository.save(user);
      console.log(`User '${user.username}' with role '${user.role}' created successfully`);
      return {
        username: user.username,
        email: user.email,
        role: user.role,
        id: user.id
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(email: string, updateUserDto: UpdatePlayerDto): Promise<Player> {
    try {
      const user = await this.userRepository.findOneBy({ email });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
  
      Object.assign(user, updateUserDto);
  
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(email: string): Promise<string> {
    try {
      const result = await this.userRepository.delete({ email });

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return 'User deleted succesfully'
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getAllUsers(): Promise<Player[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  async getByEmail(email: string): Promise<Player> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new NotFoundException('Failed to get user');
    }
  }
}