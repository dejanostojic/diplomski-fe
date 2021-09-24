import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimberDetailsComponent } from './climber-details.component';

describe('ClimberDetailsComponent', () => {
  let component: ClimberDetailsComponent;
  let fixture: ComponentFixture<ClimberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimberDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
