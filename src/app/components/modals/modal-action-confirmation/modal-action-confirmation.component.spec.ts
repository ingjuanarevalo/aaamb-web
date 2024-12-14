import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActionConfirmationComponent } from './modal-action-confirmation.component';

describe('ModalActionConfirmationComponent', () => {
  let component: ModalActionConfirmationComponent;
  let fixture: ComponentFixture<ModalActionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalActionConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalActionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
