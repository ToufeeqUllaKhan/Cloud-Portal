import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataConfigurationListComponent } from './data-configuration-list.component';

describe('DataConfigurationListComponent', () => {
  let component: DataConfigurationListComponent;
  let fixture: ComponentFixture<DataConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
