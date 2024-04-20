import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-assignation-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `<form>
    <h2 mat-dialog-title>Asignar curso</h2>
    <mat-dialog-content>
      <div class="flex">
        <mat-form-field class="w-96">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Buscar</mat-label>
          <input type="text" matInput placeholder="Buscar cursos" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close type="button">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-flat-button type="submit">Guardar cambios</button>
    </mat-dialog-actions>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseAssignationFormComponent {}
