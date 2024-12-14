import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackbar: MatSnackBar) {}

  presentSuccessToast(message: string, duration = 3000, action = ''): void {
    try {
      const panelClasses: Array<string> = ['success-toast'];
      this.snackbar.open(message, action, {
        duration,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: panelClasses
      });
    } catch (error) {
      console.error(error);
    }
  }

  presentErrorToast(message: string, duration = 3000, action = ''): void {
    try {
      const panelClasses: Array<string> = ['error-toast'];
      this.snackbar.open(message, action, {
        duration,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: panelClasses
      });
    } catch (error) {
      console.error(error);
    }
  }

  presentGeneralErrorToast(): void {
    try {
      this.presentErrorToast('There was a general error');
    } catch (error) {
      console.error(error);
    }
  }
}
