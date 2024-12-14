import { ETaskPriority } from '../enums/task-priority.enum';
import { ETaskStatus } from '../enums/task-status.enum';
import { ITaskHistory } from './task-history.interface';

export interface ITask {
  title: string;
  description?: string;
  status: ETaskStatus;
  priority?: ETaskPriority;
  dueDate: Date;
  tags?: Array<string>;
  history: Array<ITaskHistory>;
  deletedAt?: Date;
}
