import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDesignationDialogComponent } from './update-designation-dialog.component';

describe('UpdateDesignationDialogComponent', () => {
  let component: UpdateDesignationDialogComponent;
  let fixture: ComponentFixture<UpdateDesignationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDesignationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDesignationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
