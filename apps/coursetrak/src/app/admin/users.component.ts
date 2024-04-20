import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '@coursetrak/types';
import { patchState } from '@ngrx/signals';
import { debounceTime } from 'rxjs/operators';
import { CourseAssignationFormComponent } from './course-assignation-form.component';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    ReactiveFormsModule,
    MatIconButton,
    MatMenuModule,
  ],
  providers: [UsersStore],
  template: `<div class="p-3">
    <div class="flex">
      <mat-form-field class="w-96">
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Buscar</mat-label>
        <input
          type="text"
          matInput
          [formControl]="searchControl"
          placeholder="Buscar usuarios"
        />
      </mat-form-field>
    </div>
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="first_name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let item">
          {{ item.first_name }}
        </td> </ng-container
      ><ng-container matColumnDef="father_name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Apellido</th>
        <td mat-cell *matCellDef="let item">
          {{ item.father_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="document_id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Cedula</th>
        <td mat-cell *matCellDef="let item">
          {{ item.document_id }}
        </td> </ng-container
      ><ng-container matColumnDef="entity.short_name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Entidad</th>
        <td mat-cell *matCellDef="let item">
          {{ item.entity.short_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="updated_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Actualizado</th>
        <td mat-cell *matCellDef="let item">
          {{ item.updated_at | date : 'medium' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="assignCourse(item.id)">
              <mat-icon>assignment</mat-icon>
              Asignar curso
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <mat-paginator [pageSizeOptions]="[10]" />
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<User>([]);
  public displayedColumns = [
    'first_name',
    'father_name',
    'document_id',
    'entity.short_name',
    'updated_at',
    'actions',
  ];
  sort = viewChild.required(MatSort);
  paginator = viewChild.required(MatPaginator);
  searchControl = new FormControl('', { nonNullable: true });
  private store = inject(UsersStore);
  private injector = inject(Injector);
  private dialog = inject(MatDialog);

  ngAfterViewInit() {
    effect(
      () => {
        this.dataSource.data = this.store.filtered();
        this.dataSource.paginator = this.paginator();
        this.dataSource.sort = this.sort();
      },
      { injector: this.injector }
    );

    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (val) => patchState(this.store, { queryText: val }),
    });
  }

  assignCourse(userId: string) {
    this.dialog.open(CourseAssignationFormComponent, {
      disableClose: true,
      width: '64rem',
      minWidth: '50vw',
      maxWidth: '90vw',
    });
  }
}
