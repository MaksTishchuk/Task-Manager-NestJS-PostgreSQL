import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param, ParseIntPipe,
  Patch,
  Post,
  Put,
  Query, UseGuards,
  UsePipes, ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";
import {TaskEntity} from "../entities/task.entity";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {TaskStatus} from "./dto/task-status.enum";
import {UserEntity} from "../entities/user.entity";
import {GetUser} from "../auth/decorators/get-user.decorator";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity[]> {
    this.logger.verbose(`User ${user.username} retrieving tasks. Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    this.logger.verbose(`User ${user.username} retrieving task with Id: ${id}.`)
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    this.logger.verbose(`User ${user.username} try to create task. Data: ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.creatTask(createTaskDto, user)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserEntity
  ) {
    this.logger.verbose(`User ${user.username} try to update task with Id: ${id}. Data: ${JSON.stringify(UpdateTaskDto)}`)
    return this.tasksService.updateTask(id, updateTaskDto, user)
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    this.logger.verbose(`User ${user.username} try to update task status with Id: ${id}.`)
    return this.tasksService.updateTaskStatus(id, status, user)
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity
  ): Promise<void> {
    this.logger.verbose(`User ${user.username} try to delete task with Id: ${id}.`)
    return this.tasksService.deleteTask(id, user)
  }
}
