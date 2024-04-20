import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesItemsComponent } from './courses-items.component';

describe('CoursesItemsComponent', () => {
  let component: CoursesItemsComponent;
  let fixture: ComponentFixture<CoursesItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
