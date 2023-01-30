
import {IsIn, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {TaskStatus} from "./task-status.enum";

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus
}