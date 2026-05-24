import { IsISO8601, IsNotEmpty } from 'class-validator'

export class SchedulePostDto {
  @IsISO8601()
  @IsNotEmpty()
  scheduledAt!: string
}
