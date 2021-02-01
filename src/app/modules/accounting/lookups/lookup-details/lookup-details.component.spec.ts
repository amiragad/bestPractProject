import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupDetailsComponent } from './lookup-details.component';

describe('LookupDetailsComponent', () => {
  let component: LookupDetailsComponent;
  let fixture: ComponentFixture<LookupDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
