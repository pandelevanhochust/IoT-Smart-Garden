import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { RegisterDto } from 'src/dto/RegisterDto';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';

@ApiBearerAuth('JWT-auth')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //User
  @Roles(Role.User)
  @Get('hello')
  async staffGreet(@Request() req): Promise<{ user: any }> {
    // console.log(req);
    return {
      user: req.user,
    };
  }

  @Roles(Role.Admin)
  @Get()
  async listAllUser(): Promise<User[]> {
    return this.userService.listAllUser();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async listIndexUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.listIndexUser(id);
  }

  @ApiBody({ type: RegisterDto })
  @Post()
  async createUser(@Body() userDto: RegisterDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @ApiBody({ type: UserDto })
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UserDto,
  ): Promise<{ msg: string }> {
    return this.userService.updateUser(id, updateDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result = this.userService.deleteUser(id);
    return result;
  }

  //NestExpress Version
  // @Get()
  // async listAllUser(@Res() res: Response) {
  // const data = this.userService.listAllUser();
  // return res.status(HttpStatus.OK).json(data);
  // }

  // @Get(':id')
  // async listIndexUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  // const data = this.userService.listIndexUser(id);
  // return res.status(HttpStatus.OK).json(data);
  // }

  // @Post()
  // async staffInfo(@Body() postUser: UserDto, @Res() res: Response) {
  // const result = this.userService.createUser(postUser);
  // return res.status(HttpStatus.CREATED).json(result);
  // }

  // @Put(':id')
  // async updateUser(@Param('id',ParseIntPipe) id:number,@Body() update_staff: UserDto, @Res() res: Response): Promise<object>{
  //     const data = this.userService.updateUser(id,update_staff);
  //     return res.status(HttpStatus.OK).json(data);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id',ParseIntPipe) id:number, @Res() res: Response): Promise<object>{
  //     const data = this.userService.deleteUser(id);
  //     return res.status(HttpStatus.OK).json(data);
  // }
}
