import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-action-confirmation',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './modal-action-confirmation.component.html',
  styleUrl: './modal-action-confirmation.component.scss'
})
export class ModalActionConfirmationComponent implements OnInit {
  header!: string;
  message!: string;
  cancelText!: string;
  confirmText!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalActionConfirmationComponent>
  ) {}

  ngOnInit(): void {
    const receivedData = this.data || null;
    const { header, message, cancelText, confirmText } = receivedData;
    if (!header || !message || !cancelText || !confirmText) {
      this.closeModal();
      return;
    }
    this.header = header;
    this.message = message;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
  }

  closeModal(result?: any): void {
    this.dialogRef.close(result);
  }

  confirmAction(): void {
    this.closeModal({ confirmAction: true });
  }
}
