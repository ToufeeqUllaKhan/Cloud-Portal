import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDbTestComponent } from './api-db-test.component';

describe('ApiDbTestComponent', () => {
  let component: ApiDbTestComponent;
  let fixture: ComponentFixture<ApiDbTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiDbTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDbTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
