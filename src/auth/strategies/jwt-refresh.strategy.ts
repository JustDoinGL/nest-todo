import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "src/utils/types/jwt-Payload";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(
		private readonly config: ConfigService,
		private readonly userService: UsersService
	) {
		super({
			jwtFromRequest: (req: Request) => req.cookies["refreshToken"],
			ignoreExpiration: false,
			secretOrKey: config.getOrThrow("JWT_REFRESH_SECRET")
		});
	}

	async validate({ userId }: JwtPayload) {
		const user = this.userService.getUser({ id: userId });

		if (!user) throw new UnauthorizedException();

		return user;
	}
}
