import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllSmartRulesComponent } from './allSmartRules.component';

describe('SmartRulesComponent', () => {
  let component: AllSmartRulesComponent;
  let fixture: ComponentFixture<AllSmartRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSmartRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSmartRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
