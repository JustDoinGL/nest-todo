import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@IsDefined()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	hashedPassword?: string;
}
