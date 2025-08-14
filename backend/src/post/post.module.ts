import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule],
  providers: [PostService, PrismaService],
  controllers: [PostController]
})
export class PostModule {}
