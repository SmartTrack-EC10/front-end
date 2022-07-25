import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRulesComponent } from './smart-rules.component';

describe('SmartRulesComponent', () => {
  let component: SmartRulesComponent;
  let fixture: ComponentFixture<SmartRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
