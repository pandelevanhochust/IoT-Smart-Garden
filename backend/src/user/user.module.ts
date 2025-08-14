import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileController } from './profile.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController,ProfileController],
    providers: [UserService,PrismaService],
    exports: [UserService]
})
export class UserModule {}

