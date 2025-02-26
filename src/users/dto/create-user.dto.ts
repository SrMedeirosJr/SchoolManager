export class CreateUserDto {
    name: string;
    password: string;
    role?: 'user' | 'admin';
    
}