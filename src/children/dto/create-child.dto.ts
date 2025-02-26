import { IsNotEmpty, IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateChildDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  @IsNotEmpty()
  @IsDate()
  enrollmentDate: Date;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsNumber()
  feeAmount: number;

  @IsNotEmpty()
  @IsNumber()
  dueDate: number;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  fatherPhone?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  motherPhone?: string;
}
