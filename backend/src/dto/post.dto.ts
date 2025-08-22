import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  @ApiProperty({ example: 'Getting Started with NestJS' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.' })
  content: string;

  @IsInt()
  userId: number;
}
