import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
