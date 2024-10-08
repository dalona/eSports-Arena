import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/common/enums/role.enum";
import { Tournament } from "src/tournaments/entities/tournament.entity";

import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity("Players")
export class Player {
    @ApiProperty({
        example: '1',
        description: 'Unique identifier type number: Player ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'enum', enum: Role, default: Role.Player })
    // @Column({ type: 'enum', enum: Role })
    role: Role;

    @ApiProperty({
        example: 'dalona126',
        description: 'Full name',
        uniqueItems:true
    })
    @Column('varchar',{
        length: 150,
        nullable: false,
        name: 'name'})
    username: string;

    @ApiProperty({
        example: 'cristo@example.com',
        description: 'e-mail address',
        uniqueItems:true
    })
    @Column('varchar',{
        unique: true,
        length: 150,
        nullable: false,
        name: 'email'})
    email: string;

    @ApiProperty({
        example: 'Qwerty1234*',
        description: 'The password must contain uppercase, lowercase, numeric and special characters.',
        uniqueItems:true
    })
    @Column('varchar', { 
        length: 105, 
        select: false, 
        nullable: false })
    password: string;
    
    @ApiProperty({        
        description: 'Date of user registration. Automatic date.',
        uniqueItems:true
    })
    @CreateDateColumn({ type: 'timestamp' })
    registrationDate: Date;

    @ApiProperty({
        description: 'Date of last update.',
        uniqueItems:true
    })
    @UpdateDateColumn({ type: 'timestamp' })
    lastUpdateDate: Date;

    @ManyToMany(() => Tournament, tournament => tournament.players)
    tournaments: Tournament[];

}
