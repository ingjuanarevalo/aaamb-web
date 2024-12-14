import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskManagerComponent } from './modal-task-manager.component';

describe('ModalTaskManagerComponent', () => {
  let component: ModalTaskManagerComponent;
  let fixture: ComponentFixture<ModalTaskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTaskManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
