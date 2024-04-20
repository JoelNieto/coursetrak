import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `<h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions>
      @if(!data.hideCancel) {
      <button mat-button mat-dialog-close>Cancelar</button>
      }
      <button mat-flat-button [mat-dialog-close]="true">Si</button>
    </mat-dialog-actions>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogComponent {
  public data: { message: string; title: string; hideCancel?: boolean } =
    inject(MAT_DIALOG_DATA);
}
