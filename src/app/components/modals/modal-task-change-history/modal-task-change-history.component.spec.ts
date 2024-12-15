import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskChangeHistoryComponent } from './modal-task-change-history.component';

describe('ModalTaskChangeHistoryComponent', () => {
  let component: ModalTaskChangeHistoryComponent;
  let fixture: ComponentFixture<ModalTaskChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTaskChangeHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTaskChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
