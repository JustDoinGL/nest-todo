import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwt: JwtService,
		private readonly config: ConfigService
	) {}

	async register({ password, email }: RegisterDto, res: Response) {
		const hashedPassword = await bcrypt.hash(password, 10);

		const createUser = await this.userService.create({ hashedPassword, email });

		return await this.generatedToken(createUser.id, res);
	}

	async validateUser(email: string, password: string) {
		const userByEmail = await this.userService.getUser({ email });

		if (!userByEmail) return null;

		const isValidPassword = await bcrypt.compare(
			password,
			userByEmail.hashedPassword
		);

		if (!isValidPassword) return null;

		return userByEmail;
	}

	async logout(res: Response) {
		return res.cookie("refreshToken", "");
	}

	async googleAuth(email: string, res: Response) {
		const userByEmail = await this.userService.getUser({ email });

		if (userByEmail) return await this.generatedToken(userByEmail.id, res);

		const createdUser = await this.userService.create({ email }, true);

		return await this.generatedToken(createdUser.id, res);
	}

	// Private method
	async generatedToken(userId: number, res: Response) {
		const accessToken = await this.jwt.signAsync(
			{ userId },
			{
				secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
				expiresIn: this.config.getOrThrow("JWT_ACCESS_EXPIRES")
			}
		);

		const refreshToken = await this.jwt.signAsync(
			{ userId },
			{
				secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
				expiresIn: this.config.getOrThrow("JWT_REFRESH_EXPIRES")
			}
		);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true
		});

		return accessToken;
	}
}
