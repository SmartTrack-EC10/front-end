import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMapPointsComponent } from './dialogMapPoints.component';

describe('SmartRulesComponent', () => {
  let component: DialogMapPointsComponent;
  let fixture: ComponentFixture<DialogMapPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMapPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMapPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
