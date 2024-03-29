import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseClimberComponent } from './choose-climber.component';

describe('ClimberListComponent', () => {
  let component: ChooseClimberComponent;
  let fixture: ComponentFixture<ChooseClimberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseClimberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseClimberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
