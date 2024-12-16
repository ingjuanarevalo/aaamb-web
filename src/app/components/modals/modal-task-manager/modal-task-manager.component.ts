import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { ToastService } from '../../../services/toast/toast.service';
import { cloneDeep } from 'lodash-es';
import { ITask } from '../../../interfaces/task.interface';
import { ETaskStatus } from '../../../enums/task-status.enum';
import { ETaskPriority } from '../../../enums/task-priority.enum';
import { DateTime } from 'luxon';
import { AlertService } from '../../../services/alert/alert.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomValidator } from '../../../validators/custom_validator';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-modal-task-manager',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatChipsModule
  ],
  templateUrl: './modal-task-manager.component.html',
  styleUrl: './modal-task-manager.component.scss'
})
export class ModalTaskManagerComponent implements OnInit, OnDestroy {
  isLoadingTask = true;
  editMode = false;
  taskForm!: FormGroup;
  isSavingTask = false;
  showCloseAlert = false;
  taskId!: string;
  ETaskStatus = ETaskStatus;
  ETaskPriority = ETaskPriority;

  datesBeforeTodayFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date >= today : false;
  };

  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalTaskManagerComponent>,
    private api: ApiService,
    private toast: ToastService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async getTaskById(): Promise<ITask | undefined> {
    try {
      const { task }: { task: ITask } = await firstValueFrom(this.api.getTaskById(this.taskId));
      return task;
    } catch (errorResponse: any) {
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error fetching a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
      return;
    }
  }

  async initForm(): Promise<void> {
    const taskId = this.data?.taskId || null;
    let existingTask: ITask | undefined;
    if (taskId) {
      this.editMode = true;
      this.taskId = taskId;
      existingTask = await this.getTaskById();
    }

    this.taskForm = new FormGroup(
      {
        title: new FormControl(existingTask?.title || null, [Validators.required, Validators.minLength(3)]),
        description: new FormControl(existingTask?.description || null, Validators.maxLength(500)),
        status: new FormControl(existingTask?.status || ETaskStatus.Pending, Validators.required),
        priority: new FormControl(existingTask?.priority || ETaskPriority.Medium),
        dueDate: new FormControl(existingTask?.dueDate ? DateTime.fromISO(existingTask.dueDate) : null, Validators.required),
        dueDateTime: new FormControl(existingTask?.dueDate ? DateTime.fromISO(existingTask.dueDate) : null, Validators.required),
        tags: new FormControl(existingTask?.tags || [])
      },
      { validators: CustomValidator.validateDueDate }
    );

    this.listenForChanges();
    this.isLoadingTask = false;
  }

  listenForChanges(): void {
    this.taskForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.showCloseAlert = true;
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  async confirmCloseModal(): Promise<any> {
    if (this.showCloseAlert) {
      const closeModal = await this.alert.presentCloseWindowAlert();
      return closeModal ? this.closeModal() : null;
    }

    this.closeModal();
  }

  closeModal(result?: any): void {
    this.dialogRef.close(result);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentTags: Array<string> = this.taskForm.get('tags')?.value;
      const tagExists = currentTags.includes(value);
      if (!tagExists) {
        currentTags.push(value);
      } else {
        this.toast.presentErrorToast('You cannot add a repeated tag');
      }
    }
    event.chipInput.clear();
  }

  removeTag(index: number): void {
    const currentTags = this.taskForm.get('tags')?.value;
    currentTags.splice(index, 1);
  }

  async saveTask(): Promise<void> {
    try {
      this.isSavingTask = true;
      const body = this.taskForm.value;
      // It maps DueDate correctly
      const dueDateDT = body.dueDate as DateTime;
      const dueDateTimeDT = body.dueDateTime as DateTime;
      const year = dueDateDT.get('year');
      const month = dueDateDT.get('month');
      const day = dueDateDT.get('day');
      const hour = dueDateTimeDT.get('hour');
      const minute = dueDateTimeDT.get('minute');
      const second = dueDateTimeDT.get('second');
      const millisecond = dueDateTimeDT.get('millisecond');
      body.dueDate = DateTime.fromObject({
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond
      })
        .toUTC()
        .toISO();
      delete body.dueDateTime;
      let response = null;
      if (!this.editMode) {
        response = await firstValueFrom(this.api.createTask(body));
      } else {
        response = await firstValueFrom(this.api.updateTask(this.taskId, body));
      }
      this.isSavingTask = false;
      this.toast.presentSuccessToast('Task saved successfully');
      this.closeModal({ task: response.task });
    } catch (errorResponse: any) {
      this.isSavingTask = false;
      const errorMessage = errorResponse?.error?.message;
      const defaultError = 'There was an error saving a task';
      this.toast.presentErrorToast(errorMessage || defaultError);
    }
  }
}
