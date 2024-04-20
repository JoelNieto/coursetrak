import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesItemsFormComponent } from './courses-items-form.component';

describe('CoursesItemsFormComponent', () => {
  let component: CoursesItemsFormComponent;
  let fixture: ComponentFixture<CoursesItemsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesItemsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesItemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
