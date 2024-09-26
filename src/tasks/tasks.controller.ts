import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Patch
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "@prisma/client";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	async getTasks(): Promise<Task[]> {
		return this.tasksService.getTasks();
	}

	@Get(":id")
	async getTask(@Param("id", ParseIntPipe) id: string): Promise<Task> {
		return this.tasksService.getTask(Number(id));
	}

	@Post()
	async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
		return this.tasksService.createTask(dto);
	}

	@Patch(":id")
	async updateTask(
		@Param("id", ParseIntPipe) id: string,
		@Body() dto: UpdateTaskDto
	): Promise<Task> {
		return this.tasksService.updateTask(Number(id), dto);
	}

	@Delete(":id")
	async deleteTask(@Param("id", ParseIntPipe) id: string): Promise<Task> {
		return this.tasksService.deleteTask(Number(id));
	}
}
