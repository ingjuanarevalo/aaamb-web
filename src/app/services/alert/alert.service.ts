import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ModalActionConfirmationComponent } from '../../components/modals/modal-action-confirmation/modal-action-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  async presentConfirmActionAlert(header: string, message: string, cancelText: string, confirmText: string): Promise<any> {
    const dialog = this.dialog.open(ModalActionConfirmationComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'modal-general',
      width: '85%',
      maxWidth: '370px',
      maxHeight: '80vh',
      height: 'fit-content',
      autoFocus: false,
      data: {
        header,
        message,
        cancelText,
        confirmText
      }
    });

    const dialogResponse = await firstValueFrom(dialog.afterClosed());
    return dialogResponse?.confirmAction ? true : false;
  }

  async presentCloseWindowAlert(): Promise<boolean> {
    const header = 'Cerrar ventana';
    const message = 'Are you sure to close this window? Changes made will be lost.';
    const notClose = 'Do not close';
    const close = 'Close';
    return await this.presentConfirmActionAlert(header, message, notClose, close);
  }
}
