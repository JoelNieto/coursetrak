import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Course } from '@coursetrak/types';
import { MatDialog } from '@angular/material/dialog';
import { CourseFormComponent } from './course-form.component';
import { AdminCoursesStore } from './courses.store';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatIcon,
    DatePipe,
    RouterLink,
  ],
  providers: [AdminCoursesStore],
  template: `<div class="p-3">
    <div class="flex justify-between items-baseline">
      <mat-form-field class="w-96">
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Buscar</mat-label>
        <input type="text" matInput placeholder="Buscar cursos" />
      </mat-form-field>
      <button mat-flat-button color="primary" (click)="editCourse()">
        Nuevo
      </button>
    </div>
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titulo</th>
        <td mat-cell *matCellDef="let item">
          {{ item.title }}
        </td>
      </ng-container>
      <ng-container matColumnDef="code">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Codigo</th>
        <td mat-cell *matCellDef="let item">
          {{ item.code }}
        </td>
      </ng-container>
      <ng-container matColumnDef="created_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Creado</th>
        <td mat-cell *matCellDef="let item">
          {{ item.created_at | date : 'medium' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/courses', item.id]">
              <mat-icon>info</mat-icon>
              Detalles
            </a>
            <button mat-menu-item (click)="editCourse(item)">
              <mat-icon>edit_square</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item (click)="deleteCourse(item.id)">
              <mat-icon>delete</mat-icon>
              <span>Borrar</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <mat-paginator [pageSizeOptions]="[5, 10]" [showFirstLastButtons]="true" />
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesAdminComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<Course>([]);
  public displayedColumns = ['title', 'code', 'created_at', 'actions'];
  private dialog = inject(MatDialog);
  private store = inject(AdminCoursesStore);
  private containerRef = inject(ViewContainerRef);
  private injector = inject(Injector);
  private sort = viewChild.required(MatSort);
  private paginator = viewChild.required(MatPaginator);

  ngAfterViewInit() {
    effect(
      () => {
        this.dataSource.data = this.store.courses();
        this.dataSource.sort = this.sort();
        this.dataSource.paginator = this.paginator();
      },
      { injector: this.injector }
    );
  }

  editCourse(course?: Course) {
    this.dialog.open(CourseFormComponent, {
      width: '48rem',
      viewContainerRef: this.containerRef,
      data: course,
    });
  }

  deleteCourse(id: string) {
    this.store.deleteCourse(id);
  }
}
