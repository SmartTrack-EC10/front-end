import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuleComponent } from './mapRule.component';

describe('SmartRulesComponent', () => {
  let component: MapRuleComponent;
  let fixture: ComponentFixture<MapRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
