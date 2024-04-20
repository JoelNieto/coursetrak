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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Entity } from '@coursetrak/types';

import { EntitiesFormComponent } from './entities-form.component';
import { EntitiesStore } from './entities.store';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [EntitiesStore],
  template: ` <div class="p-3">
    <div class="flex justify-between items-baseline">
      <mat-form-field class="w-96">
        <mat-label for="table-search">Buscar</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          id="table-search"
          placeholder="Search for items"
          matInput
        />
      </mat-form-field>

      <button mat-flat-button (click)="editEntity()">
        <mat-icon>add</mat-icon>
        <span>Nuevo</span>
      </button>
    </div>
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let item">
          {{ item.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="short_name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Siglas</th>
        <td mat-cell *matCellDef="let item">
          {{ item.short_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editEntity(item)">
              <mat-icon>edit_square</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item (click)="deleteEntity(item.id)">
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
export class EntitiesComponent implements AfterViewInit {
  public store = inject(EntitiesStore);
  public paginator = viewChild.required(MatPaginator);
  public sort = viewChild.required(MatSort);
  public dataSource = new MatTableDataSource<Entity>([]);
  public displayedColumns = ['name', 'short_name', 'actions'];
  public dialog = inject(MatDialog);
  private injector = inject(Injector);
  private container = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    effect(
      () => {
        this.dataSource.data = this.store.entities();
      },
      { injector: this.injector }
    );

    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  editEntity(entity?: Entity) {
    this.dialog.open(EntitiesFormComponent, {
      width: '48rem',
      viewContainerRef: this.container,
      data: entity,
    });
  }

  deleteEntity(id: string) {
    this.store.deleteEntity(id);
  }
}
