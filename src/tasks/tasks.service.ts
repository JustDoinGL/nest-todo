import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
	constructor(private readonly prisma: PrismaService) {}

	async getTasks(): Promise<Task[]> {
		return this.prisma.task.findMany();
	}

	async getTask(id: number): Promise<Task> {
		return this.getTaskOrThrow(id);
	}

	async createTask(dto: CreateTaskDto): Promise<Task> {
		return this.prisma.task.create({ data: dto });
	}

	async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
		await this.getTaskOrThrow(id);
		return this.prisma.task.update({ where: { id }, data: dto });
	}

	async deleteTask(id: number): Promise<Task> {
		await this.getTaskOrThrow(id);
		return this.prisma.task.delete({ where: { id } });
	}

	// Private method
	private async getTaskOrThrow(id: number): Promise<Task> {
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) throw new NotFoundException("Task not found");
		return task;
	}
}
