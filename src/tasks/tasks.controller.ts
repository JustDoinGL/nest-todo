import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Patch,
	UseGuards
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "@prisma/client";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";

@UseGuards(JwtAccessGuard)
@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	async getTasks(@CurrentUser("id", ParseIntPipe) userId: number): Promise<Task[]> {
		return this.tasksService.getTasks(userId);
	}

	@Get(":id")
	async getTask(
		@Param("id", ParseIntPipe) id: number,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.getTask(id, userId);
	}

	@Post()
	async createTask(
		@Body() dto: CreateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.createTask(dto, userId);
	}

	@Patch(":id")
	async updateTask(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.updateTask(id, dto, userId);
	}

	@Delete(":id")
	async deleteTask(
		@Param("id", ParseIntPipe) id: number,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.deleteTask(id, userId);
	}
}
