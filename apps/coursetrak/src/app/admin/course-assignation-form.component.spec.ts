import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseAssignationFormComponent } from './course-assignation-form.component';

describe('CourseAssignationFormComponent', () => {
  let component: CourseAssignationFormComponent;
  let fixture: ComponentFixture<CourseAssignationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseAssignationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseAssignationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
