import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createEmployeeDto: Partial<Employee>, @Request() req): Promise<Employee> {
    return this.employeesService.create(createEmployeeDto, req.user.id); // Passa o ID do usuário autenticado
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateEmployeeDto: Partial<Employee>, @Request() req): Promise<Employee> {
    return this.employeesService.update(id, updateEmployeeDto, req.user.id); // Passa o ID do usuário autenticado
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req): Promise<void> {
    return this.employeesService.remove(id, req.user.id); // Passa o ID do usuário autenticado
  }
}
