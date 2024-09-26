import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
	constructor(private readonly prisma: PrismaService) {}

	async getTasks(userId: number): Promise<Task[]> {
		return this.prisma.task.findMany({ where: { userId } });
	}

	async getTask(id: number, userId: number): Promise<Task> {
		return this.getTaskOrThrow(id, userId);
	}

	async createTask(dto: CreateTaskDto, userId: number) {
		return await this.prisma.task.create({
			data: {
				...dto,
				userId
			}
		});
	}

	async updateTask(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
		await this.getTaskOrThrow(id, userId);

		return this.prisma.task.update({ where: { id }, data: dto });
	}

	async deleteTask(id: number, userId: number): Promise<Task> {
		await this.getTaskOrThrow(id, userId);

		return this.prisma.task.delete({ where: { id } });
	}

	// Private method
	private async getTaskOrThrow(id: number, userId: number): Promise<Task> {
		const task = await this.prisma.task.findUnique({ where: { id, userId } });

		if (!task) throw new NotFoundException("Task not found");

		return task;
	}
}
