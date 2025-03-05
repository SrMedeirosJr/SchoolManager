import {
    Controller,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Get,
    Request,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { AuthGuard } from '../auth/auth.guard';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Post('login')
    async login(@Body() body) {
      return this.usersService.login(body.name, body.password);
    }

    @Get('profile')
    @UseGuards(new AuthGuard())
    async getProfile(@Request() req) {
    return req.user; // Retorna os dados do usuário autenticado
    }

    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
     return this.usersService.findAll();
  }
  
    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: CreateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }
  
    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number) {
      return this.usersService.remove(id);
    }
  }
  