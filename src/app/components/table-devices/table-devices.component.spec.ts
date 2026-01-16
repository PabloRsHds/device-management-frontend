import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDevicesComponent } from './table-devices.component';

describe('TableDevicesComponent', () => {
  let component: TableDevicesComponent;
  let fixture: ComponentFixture<TableDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDevicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
