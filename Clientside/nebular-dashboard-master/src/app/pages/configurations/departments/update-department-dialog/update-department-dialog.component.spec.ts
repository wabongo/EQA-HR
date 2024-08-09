import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDepartmentDialogComponent } from './update-department-dialog.component';

describe('UpdateDepartmentDialogComponent', () => {
  let component: UpdateDepartmentDialogComponent;
  let fixture: ComponentFixture<UpdateDepartmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDepartmentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDepartmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
