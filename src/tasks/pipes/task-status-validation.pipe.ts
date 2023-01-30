import {BadRequestException, PipeTransform} from "@nestjs/common";
import {TaskStatus} from "../dto/task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform{
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]
  transform(value: any): any {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status!`)
    }
    return value
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status) // indexOf возвращает -1, если такого нетв списке
    return index !== -1
  }
}