import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostDto {
  @ApiProperty({ example: 'My Post Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is the content of the post.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  authorId?: number;
}
