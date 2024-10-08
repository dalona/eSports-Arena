// src/matches/result.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { eager: true })
  winner: Player;

  @ManyToOne(() => Player, { eager: true })
  loser: Player;

  @Column('int')
  winnerScore: number;

  @Column('int')
  loserScore: number;
}
