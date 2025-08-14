import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostDto } from '../dto/post.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() postDto: PostDto): Promise<object> {
    return this.postService.createPost(postDto);
  }

  @Get()
  async getAllPosts(): Promise<object> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.postService.getPostById(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: Partial<PostDto>
  ): Promise<object> {
    return this.postService.updatePost(id, postDto);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.postService.deletePost(id);
  }
}
