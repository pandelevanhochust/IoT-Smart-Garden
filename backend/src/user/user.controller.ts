import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/dto/RegisterDto';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    //User
    @Get('hello')
    async staffgreed(): Promise<string> {
        return 'Hello how low';
    }

    @Get()
    async listAllUser(): Promise<User[]> {
        return (this.userService.listAllUser());
    }

    @Get(':id')
    async listIndexUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.listIndexUser(id);
    }

    @Post()
    async createUser(@Body() userDto: RegisterDto): Promise<User> {
        return this.userService.createUser(userDto);
    }

    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number, @Body() updateDto: UserDto): Promise<{ msg: string }> {
        return this.userService.updateUser(id, updateDto);
    }


    @Delete(':id')
    async deleteUser(@Param('id',ParseIntPipe) id:number): Promise<object>{
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