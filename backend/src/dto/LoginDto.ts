import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @ApiProperty({ example: 'tensou' })
    username: string;

    @IsString()
    @ApiProperty({ example: 'thispass' })
    password: string;
    }
