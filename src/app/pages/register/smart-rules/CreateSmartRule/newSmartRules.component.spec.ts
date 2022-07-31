import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSmartRulesComponent } from './newSmartRules.component';

describe('SmartRulesComponent', () => {
  let component: NewSmartRulesComponent;
  let fixture: ComponentFixture<NewSmartRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSmartRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSmartRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
