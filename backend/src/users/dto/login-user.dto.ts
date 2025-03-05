import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail()
  name: string;

  @ApiProperty({ example: 'securepassword', description: 'Senha do usuário' })
  @IsNotEmpty()
  password: string;
}