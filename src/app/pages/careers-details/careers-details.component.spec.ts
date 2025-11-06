import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersDetailsComponent } from './careers-details.component';

describe('CareersDetailsComponent', () => {
  let component: CareersDetailsComponent;
  let fixture: ComponentFixture<CareersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareersDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
