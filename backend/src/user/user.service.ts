import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileDto } from 'src/dto/ProfileDto';
import { RegisterDto } from 'src/dto/RegisterDto';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // GET /api/user
  async listAllUser(): Promise<User[]> {
    console.log("Reach listAllUser");
    return await this.prisma.user.findMany();
  }

  // GET /api/user/:id
  async listIndexUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // POST /api/user
  async createUser(data: RegisterDto): Promise<User> {
    const {
      name,
      username,
      email,
      password,
      hashedPassword,
      bio = null,
      avatar = null,
    } = data;

    return this.prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
        hashedPassword,
        profile: {
          create: {
            bio,
            avatar,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  // PUT /api/user/:id
  async updateUser(id: number, updateData: UserDto): Promise<{ msg: string }> {
    await this.listIndexUser(id); // throws 404 if not found
    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
      return {
        msg: `User ${updated.name} (ID ${updated.id}) updated`,
      };
    } catch (error) {
      console.error('Error updating user:', error); 
      throw error;
    }
  }
  
  // DELETE /api/user/:id
  async deleteUser(id: number): Promise<{ msg: string }> {
    await this.listIndexUser(id); 
    const deleted = await this.prisma.user.delete({ where: { id } });
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      msg: `User with ID ${deleted.id} (${deleted.name}) was deleted successfully`,
    };
  }

    //Find user by username 
  async findUserbyUsername(username: string): Promise<any> {
    const staffMember = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!staffMember) {
      // throw new NotFoundException(`User with username ${username} not found`);
      return null;
    }
    return staffMember;
  }

// profile 

// GET /api/user/profile
  async getAllProfile(): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      include: { user: true },
    });
    return profiles;
  }

  // GET /api/user/profile/:id
  async getIndexProfile(id: number): Promise<Profile> {
    const userWithProfile = await this.prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!userWithProfile) {
      throw new NotFoundException(`Profile for user ID ${id} not found`);
    }

    return userWithProfile;
  }

  // POST /api/user/profile/:id
  async createProfile(userId: number, profileData: ProfileDto): Promise<{ msg: string; profile: Profile }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const created = await this.prisma.profile.create({
      data: {
        userId,
        ...profileData,
      },
    });

    return {
      msg: `Profile created for user ${user.name} (ID ${user.id})`,
      profile: created,
    };
  }

  // PUT /api/user/profile/:id
  async updateProfile(userId: number, profileData: ProfileDto): Promise<{ msg: string; profile: Profile }> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: profileData,
    });

    return {
      msg: `Profile for user ID ${userId} updated`,
      profile: updated,
    };
  }

  // DELETE /api/user/profile/:id
  async deleteProfile(userId: number): Promise<{ msg: string }> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    await this.prisma.profile.delete({
      where: { userId },
    });

    return {
      msg: `Profile for user ID ${userId} deleted successfully`,
    };
  }


  // CREATE user + profile during registration
  async createUserWithProfile(
    userData: Omit<User, 'id'> & { bio?: string | null; avatar?: string | null }
  ): Promise<User & { profile: Profile | null }> {
    const { bio = null, avatar = null, ...user } = userData;

    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        profile: {
          create: { bio, avatar },
        },
      },
      include: {
        profile: true,
      },
    });

    return createdUser;
  }

}
