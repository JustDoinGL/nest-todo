import {
	Controller,
	Post,
	Body,
	Res,
	UseGuards,
	ParseIntPipe,
	Get,
	Req
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { Profile } from "passport-google-oauth20";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.register(dto, res);
	}

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(
		@CurrentUser("id", ParseIntPipe) userId: number,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generatedToken(userId, res);
	}

	@UseGuards(AuthGuard("jwt-refresh"))
	@Post("refresh")
	async refresh(
		@CurrentUser("id", ParseIntPipe) userId: number,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generatedToken(userId, res);
	}

	@Post("logout")
	async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res);
	}

	// Google auth
	@UseGuards(AuthGuard("google"))
	@Get("google")
	async google() {}

	@UseGuards(AuthGuard("google"))
	@Get("google/callback")
	async googleCallback(
		@Req() req: Request & { user: Profile },
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.googleAuth(req.user._json.email, res);
	}
}
