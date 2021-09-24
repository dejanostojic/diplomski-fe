import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFeeModalComponent } from './registration-fee-modal.component';

describe('RegistrationFeeModalComponent', () => {
  let component: RegistrationFeeModalComponent;
  let fixture: ComponentFixture<RegistrationFeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationFeeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
