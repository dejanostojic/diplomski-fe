import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimberListComponent } from './climber-list.component';

describe('ClimberListComponent', () => {
  let component: ClimberListComponent;
  let fixture: ComponentFixture<ClimberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
