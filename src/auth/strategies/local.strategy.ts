import { AuthService } from "./../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocaleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: "email" });
	}

	async validate(email: string, password: string) {
		const user = this.authService.validateUser(email, password);

		if (!user) throw new UnauthorizedException("Invalid");

		return user;
	}
}
