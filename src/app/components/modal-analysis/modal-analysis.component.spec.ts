import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnalysisComponent } from './modal-analysis.component';

describe('ModalAnalysisComponent', () => {
  let component: ModalAnalysisComponent;
  let fixture: ComponentFixture<ModalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
