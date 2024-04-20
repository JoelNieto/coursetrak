import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { AlertDialogComponent } from '../alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialog = inject(MatDialog);

  openDialog = ({ message, title }: { message?: string; title?: string }) =>
    this.dialog
      .open(AlertDialogComponent, {
        width: '24rem',
        data: { message, title },
      })
      .afterClosed();

  openDialogPromise = ({
    message,
    title,
  }: {
    message?: string;
    title?: string;
  }): Promise<boolean> => firstValueFrom(this.openDialog({ message, title }));
}
