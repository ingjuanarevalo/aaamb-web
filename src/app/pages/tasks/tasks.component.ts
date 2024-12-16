import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ITask } from '../../interfaces/task.interface';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ETaskStatus } from '../../enums/task-status.enum';
import { ETaskPriority } from '../../enums/task-priority.enum';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../services/modal/modal.service';
import { DateTime } from 'luxon';
import { AlertService } from '../../services/alert/alert.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomValidator } from '../../validators/custom_validator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { pickBy } from 'lodash-es';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatPaginatorModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit, OnDestroy {
  @ViewChild('originalTable', { static: false }) originalTable!: MatTable<ITask>;
  @ViewChild('deletedTable', { static: false }) deletedTable!: MatTable<ITask>;
  @ViewChild('originalSort', { static: false }) originalSort!: MatSort;
  @ViewChild('deletedSort', { static: false }) deletedSort!: MatSort;
  @ViewChild('originalPaginator', { static: false }) originalPaginator!: MatPaginator;
  @ViewChild('deletedPaginator', { static: false }) deletedPaginator!: MatPaginator;

  screenWidth = 0;
  isLoadingTasks = true;
  mobileColumns: string[] = ['title', 'options'];
  tabletColumns: string[] = ['title', 'dueDate', 'options'];
  desktopColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'tags', 'options'];
  displayedColumns: string[] = this.desktopColumns;
  tasks!: MatTableDataSource<ITask>;
  deletedTasks!: MatTableDataSource<ITask>;
  ETaskStatus = ETaskStatus;
  ETaskPriority = ETaskPriority;
  onTasksReady = new Subject<void>();
  priorityOrder = {
    [ETaskPriority.Low]: 0,
    [ETaskPriority.Medium]: 1,
    [ETaskPriority.High]: 2
  };
  statusOrder = {
    [ETaskStatus.Pending]: 0,
    [ETaskStatus.InProgress]: 1,
    [ETaskStatus.Completed]: 2
  };
  tasksFilterForm!: FormGroup;
  isFilteringTasks = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private toast: ToastService,
    private modal: ModalService,
    private alert: AlertService
  ) {}

  @HostListener('window:resize', ['$event'])
  getScreenSize(event = null) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.screenWidth = window.innerWidth;
    this.switchColumns();
  }

  switchColumns(): void {
    if (this.screenWidth < 768) {
      this.displayedColumns = this.mobileColumns;
    } else if (this.screenWidth >= 768 && this.screenWidth < 992) {
      this.displayedColumns = this.tabletColumns;
    } else {
      this.displayedColumns = this.desktopColumns;
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.screenWidth = window.innerWidth;
    this.switchColumns();
    this.onTasksReady.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.setTasksSortAndPaginator();
    });
    this.getTasks();
    this.initFilterForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initFilterForm(): void {
    this.tasksFilterForm = new FormGroup(
      {
        status: new FormControl(null),
        priority: new FormControl(null),
        tags: new FormControl([]),
        startDate: new FormControl(null),
        endDate: new FormControl(null)
      },
      { validators: CustomValidator.validateEndDate }
    );
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentTags = this.tasksFilterForm.get('tags')?.value;
      currentTags.push(value);
    }
    event.chipInput.clear();
  }

  removeTag(index: number): void {
    const currentTags = this.tasksFilterForm.get('tags')?.value;
    currentTags.splice(index, 1);
  }

  async filterTasks(): Promise<void> {
    try {
      this.isFilteringTasks = true;
      const queryParams: any = pickBy(this.tasksFilterForm.value, (value) => value !== null && (!Array.isArray(value) || value.length));
      if (!queryParams.startDate || !queryParams.endDate) {
        delete queryParams.startDate;
        delete queryParams.endDate;
      } else if (queryParams.startDate && queryParams.endDate) {
        queryParams.startDate = (queryParams.startDate as DateTime).startOf('day').toUTC().toISO();
        queryParams.endDate = (queryParams.endDate as DateTime).endOf('day').toUTC().toISO();
      }
      const { tasks } = await firstValueFrom(this.api.getTasks(queryParams));
      this.tasks.data = [...tasks];
      this.isFilteringTasks = false;
    } catch (errorResponse: any) {
      this.isFilteringTasks = false;
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error saving a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
    }
  }

  isFilterFormEmpty(): boolean {
    return Object.values(this.tasksFilterForm.value).every(
      (value: any) => value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)
    );
  }

  setTasksSortAndPaginator(): void {
    setTimeout(() => {
      this.tasks.paginator = this.originalPaginator;
      this.deletedTasks.paginator = this.deletedPaginator;
      this.tasks.sort = this.originalSort;
      this.deletedTasks.sort = this.deletedSort;

      const customSortFunction = (data: ITask, sortHeaderId: string): string | number => {
        if (sortHeaderId === 'priority' && data.priority) {
          return this.priorityOrder[data.priority];
        } else if (sortHeaderId === 'status' && data.status) {
          return this.statusOrder[data.status];
        }

        return data[sortHeaderId as keyof ITask] as string;
      };

      this.tasks.sortingDataAccessor = customSortFunction;
      this.deletedTasks.sortingDataAccessor = customSortFunction;
    }, 200);
  }

  async getTasks(): Promise<void> {
    try {
      const { tasks } = await firstValueFrom(this.api.getTasks());
      const { tasks: deletedTasks } = await firstValueFrom(this.api.getDeletedTasks());
      this.tasks = new MatTableDataSource<ITask>([...tasks]);
      this.deletedTasks = new MatTableDataSource<ITask>([...deletedTasks]);
      this.setTasksFilter();
      this.isLoadingTasks = false;
      this.onTasksReady.next();
    } catch (errorResponse: any) {
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error saving a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
    }
  }

  setTasksFilter(): void {
    this.tasks.filterPredicate = (data: ITask, filter: string) => data.title.toLowerCase().includes(filter);
    this.deletedTasks.filterPredicate = (data: ITask, filter: string) => data.title.toLowerCase().includes(filter);
  }

  async openModalManageTask(taskId?: string): Promise<void> {
    const result = await this.modal.openModalManageTask(taskId);
    if (!result?.task) return;
    this.addTaskToOriginalTable(result.task);
  }

  addTaskToOriginalTable(task: ITask): void {
    const currentTasks = this.tasks.data;
    const taskFoundIndex = currentTasks.findIndex((currentTask) => currentTask._id === task._id);
    if (taskFoundIndex > -1) {
      currentTasks.splice(taskFoundIndex, 1, task);
    } else {
      const indexToInsert = this.findIndexToInsert(this.tasks.data, task);
      currentTasks.splice(indexToInsert, 0, task);
    }
    this.tasks.data = [...currentTasks];
  }

  findIndexToInsert(list: Array<ITask>, task: ITask): number {
    // This function does the binary search to find the right index to insert the new task given its dueDate
    const newTaskDueDateDT = DateTime.fromISO(task.dueDate);

    let left = 0;
    let right = list.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midDueDateDT = DateTime.fromISO(list[mid].dueDate);

      if (midDueDateDT > newTaskDueDateDT) {
        right = mid - 1;
      } else if (midDueDateDT < newTaskDueDateDT) {
        left = mid + 1;
      } else {
        return mid;
      }
    }

    return left;
  }

  filterAnyTask(event: Event, type: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (type === 'original') {
      this.tasks.filter = filterValue;
    } else if (type === 'deleted') {
      this.deletedTasks.filter = filterValue;
    }
  }

  async confirmDeleteTask(task: ITask): Promise<any> {
    const header = 'Delete task';
    const message = 'Are you sure to delete this task? It can be restored later.';
    const noRemove = 'Do not delete';
    const remove = 'Delete';
    const deleteTask = await this.alert.presentConfirmActionAlert(header, message, noRemove, remove);
    return deleteTask ? this.deleteTask(task) : null;
  }

  async deleteTask(task: ITask): Promise<void> {
    try {
      await firstValueFrom(this.api.deleteTask(task._id));
      this.removeTaskFromOriginalTable(task);
      this.toast.presentSuccessToast('Task deleted successfully');
    } catch (errorResponse: any) {
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error deleting a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
    }
  }

  removeTaskFromOriginalTable(task: ITask): void {
    const currentTasks = this.tasks.data;
    const taskFoundIndex = currentTasks.findIndex((currentTask) => currentTask._id === task._id);
    const removedTask = currentTasks.splice(taskFoundIndex, 1)[0];
    this.tasks.data = [...currentTasks];
    this.addTaskToDeletedTable(removedTask);
  }

  addTaskToDeletedTable(task: ITask): void {
    const indexToInsert = this.findIndexToInsert(this.deletedTasks.data, task);
    const currentDeletedTasks = this.deletedTasks.data;
    currentDeletedTasks.splice(indexToInsert, 0, task);
    this.deletedTasks.data = [...currentDeletedTasks];
  }

  async confirmRestoreTask(task: ITask): Promise<any> {
    const header = 'Restore task';
    const message = 'Are you sure to restore this task?';
    const noRemove = 'Do not restore';
    const remove = 'Restore';
    const deleteTask = await this.alert.presentConfirmActionAlert(header, message, noRemove, remove);
    return deleteTask ? this.restoreTask(task) : null;
  }

  async restoreTask(task: ITask): Promise<void> {
    try {
      await firstValueFrom(this.api.restoreTask(task._id));
      this.removeTaskFromDeletedTable(task);
      this.toast.presentSuccessToast('Task restored successfully');
    } catch (errorResponse: any) {
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error restoring a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
    }
  }

  removeTaskFromDeletedTable(task: ITask): void {
    const currentDeletedTasks = this.deletedTasks.data;
    const deletedTaskFoundIndex = currentDeletedTasks.findIndex((currentTask) => currentTask._id === task._id);
    const removedTask = currentDeletedTasks.splice(deletedTaskFoundIndex, 1)[0];
    this.deletedTasks.data = [...currentDeletedTasks];
    this.addTaskToOriginalTable(removedTask);
  }

  async openModalTaskChangeHistory(task?: ITask): Promise<void> {
    await this.modal.openModalTaskChangeHistory(task);
  }
}
