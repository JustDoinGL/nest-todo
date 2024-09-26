import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { GetUserDto } from "./dto/get-user.dto";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateUserDto, isCheck: boolean = false) {
		if (!isCheck) {
			const userByEmail = await this.prisma.user.findUnique({
				where: { email: dto.email }
			});

			if (userByEmail) throw new ConflictException("This email is dataBase");
		}

		return await this.prisma.user.create({
			data: dto
		});
	}

	async getUser({ email, id }: GetUserDto) {
		if (!email && !id) throw new BadRequestException("");

		return await this.prisma.user.findFirst({ where: { email, id } });
	}

	async getUsers() {
		return await this.prisma.user.findMany();
	}
}
