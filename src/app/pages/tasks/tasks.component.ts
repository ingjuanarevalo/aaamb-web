import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ITask } from '../../interfaces/task.interface';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ETaskStatus } from '../../enums/task-status.enum';
import { ETaskPriority } from '../../enums/task-priority.enum';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  screenWidth = 0;
  isLoadingTasks = true;
  displayedColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'tags', 'options'];
  tasks: Array<ITask> = [];
  ETaskStatus = ETaskStatus;
  ETaskPriority = ETaskPriority;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private toast: ToastService
  ) {}

  @HostListener('window:resize', ['$event'])
  getScreenSize(event = null) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.screenWidth = window.innerWidth;
    this.getTasks();
  }

  async getTasks(): Promise<void> {
    try {
      const { tasks } = await firstValueFrom(this.api.getTasks());
      this.tasks = tasks;
      this.isLoadingTasks = false;
    } catch (error) {
      this.toast.presentGeneralErrorToast();
    }
  }
}
