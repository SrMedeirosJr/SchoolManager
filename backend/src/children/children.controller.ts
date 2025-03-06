import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createChildDto: CreateChildDto, @Request() req) {
    return this.childrenService.create(createChildDto, req.user.id); // Passa o ID do usuário autenticado
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.childrenService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.childrenService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateChildDto: Partial<CreateChildDto>, @Request() req) {
    return this.childrenService.update(id, updateChildDto, req.user.id); // Passa o ID do usuário autenticado
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.childrenService.remove(id, req.user.id); // Passa o ID do usuário autenticado
  }
}
