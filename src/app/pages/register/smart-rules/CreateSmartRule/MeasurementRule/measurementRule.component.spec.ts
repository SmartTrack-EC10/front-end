import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementRuleComponent } from './measurementRule.component';

describe('SmartRulesComponent', () => {
  let component: MeasurementRuleComponent;
  let fixture: ComponentFixture<MeasurementRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
