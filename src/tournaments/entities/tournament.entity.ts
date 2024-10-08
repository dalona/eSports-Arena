// src/tournaments/tournament.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @ManyToMany(() => Player, player => player.tournaments, { cascade: true })
  @JoinTable()
  players: Player[];

  @OneToMany(() => Match, match => match.tournament)
  matches: Match[];
}
