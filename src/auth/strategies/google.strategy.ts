import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly config: ConfigService) {
		super({
			clientID: config.getOrThrow("CLIENT_ID"),
			clientSecret: config.getOrThrow("CLIENT_SECRET"),
			callbackURL: "http://localhost:3000/auth/google/callback",
			scope: ["email"]
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: any
	) {
		done(null, profile);
	}
}
