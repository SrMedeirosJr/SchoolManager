import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFinanceDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  childId?: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;
}
