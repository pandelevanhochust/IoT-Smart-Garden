import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PostDto } from '../dto/post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: PostDto): Promise<{ msg: string }> {
    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        user: { connect: { id: data.authorId } },
      },
    });
    return { msg: `Post "${post.title}" created for user ${post.userId}` };
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: { user: true },
    });
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!post) throw new NotFoundException(`Post ID ${id} not found`);
    return post;
  }

  async updatePost(id: number, data: Partial<PostDto>) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post ID ${id} not found`);

    const updated = await this.prisma.post.update({
      where: { id },
      data,
    });

    return { msg: `Post ID ${updated.id} updated` };
  }

  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post ID ${id} not found`);

    await this.prisma.post.delete({ where: { id } });
    return { msg: `Post ID ${id} deleted successfully` };
  }
}
