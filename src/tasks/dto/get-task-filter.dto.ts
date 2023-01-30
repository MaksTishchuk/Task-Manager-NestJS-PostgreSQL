
import {IsIn, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {TaskStatus} from "./task-status.enum";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string
}