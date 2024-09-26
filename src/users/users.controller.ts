import { Controller, Post, Body, Get, ParseIntPipe, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getUsers() {
		return this.usersService.getUsers();
	}

	@Get(":id")
	async getUser(@Param("id", ParseIntPipe) id: number) {
		return this.usersService.getUser({ id });
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}
}
