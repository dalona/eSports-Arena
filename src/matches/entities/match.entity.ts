// src/matches/match.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { Player } from '../../players/entities/player.entity';
import { Result } from '../../results/entities/result.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, tournament => tournament.matches, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => Player, { eager: true })
  player1: Player;

  @ManyToOne(() => Player, { eager: true })
  player2: Player;

  @OneToOne(() => Result, { cascade: true })
  @JoinColumn()
  result: Result;
}
