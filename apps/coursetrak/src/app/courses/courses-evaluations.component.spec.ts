import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesEvaluationsComponent } from './courses-evaluations.component';

describe('CoursesEvaluationsComponent', () => {
  let component: CoursesEvaluationsComponent;
  let fixture: ComponentFixture<CoursesEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesEvaluationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
