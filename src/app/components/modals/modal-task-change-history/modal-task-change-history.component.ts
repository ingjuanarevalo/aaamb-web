import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ITask } from '../../../interfaces/task.interface';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-task-change-history',
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule, MatListModule],
  templateUrl: './modal-task-change-history.component.html',
  styleUrl: './modal-task-change-history.component.scss'
})
export class ModalTaskChangeHistoryComponent implements OnInit {
  task!: ITask;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalTaskChangeHistoryComponent>
  ) {}

  ngOnInit(): void {
    const receivedTask: ITask | null = this.data?.task || null;
    if (!receivedTask) return this.closeModal();
    this.task = receivedTask;
  }

  closeModal(result?: any): void {
    this.dialogRef.close(result);
  }
}
