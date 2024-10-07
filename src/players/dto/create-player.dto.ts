import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator"
import { Role } from "src/common/enums/role.enum";

export class CreatePlayerDto {
    
    @ApiProperty({ example: 'cristo@example.com', description: 'User email' })
    @IsEmail()
    @MinLength(6)
    @MaxLength(255)
    email:string

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must include at least one uppercase letter, one lowercase letter, and one number or special character.'
    })
    password:string

    @ApiProperty({ example: 'admin', description: 'Role'})
    @IsEnum(Role, {
        message: 'Role must be either user or admin.'
    })
    role: Role;
}