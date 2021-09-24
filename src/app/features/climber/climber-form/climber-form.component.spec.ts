import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimberFormComponent } from './climber-form.component';

describe('ClimberFormComponent', () => {
  let component: ClimberFormComponent;
  let fixture: ComponentFixture<ClimberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimberFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
