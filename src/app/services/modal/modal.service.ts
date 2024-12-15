import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from '../../interfaces/task.interface';
import { isPlatformBrowser } from '@angular/common';
import { ModalTaskManagerComponent } from '../../components/modals/modal-task-manager/modal-task-manager.component';
import { firstValueFrom } from 'rxjs';
import { ModalTaskChangeHistoryComponent } from '../../components/modals/modal-task-change-history/modal-task-change-history.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private dialog: MatDialog
  ) {}

  async openModalManageTask(task?: ITask): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) return;

    const screenWidth = window.innerWidth;
    let modalWidth;
    if (screenWidth < 768) {
      modalWidth = '95%';
    } else if (screenWidth >= 768 && screenWidth < 992) {
      modalWidth = '90%';
    } else if (screenWidth >= 992 && screenWidth < 1200) {
      modalWidth = '70%';
    } else if (screenWidth >= 1200 && screenWidth < 1600) {
      modalWidth = '60%';
    } else if (screenWidth >= 1600) {
      modalWidth = '50%';
    }

    const dialogRef = this.dialog.open(ModalTaskManagerComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'modal-general',
      width: modalWidth,
      maxWidth: '100%',
      maxHeight: '80vh',
      height: 'fit-content',
      autoFocus: false,
      data: { task }
    });

    return firstValueFrom(dialogRef.afterClosed()).then((result) => (result ? result : false));
  }

  async openModalTaskChangeHistory(task?: ITask): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) return;

    const screenWidth = window.innerWidth;
    let modalWidth;
    if (screenWidth < 768) {
      modalWidth = '95%';
    } else if (screenWidth >= 768 && screenWidth < 992) {
      modalWidth = '90%';
    } else if (screenWidth >= 992 && screenWidth < 1200) {
      modalWidth = '70%';
    } else if (screenWidth >= 1200 && screenWidth < 1600) {
      modalWidth = '60%';
    } else if (screenWidth >= 1600) {
      modalWidth = '50%';
    }

    const dialogRef = this.dialog.open(ModalTaskChangeHistoryComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'modal-general',
      width: modalWidth,
      maxWidth: '100%',
      maxHeight: '80vh',
      height: 'fit-content',
      autoFocus: false,
      data: { task }
    });

    return firstValueFrom(dialogRef.afterClosed()).then((result) => (result ? result : false));
  }
}
