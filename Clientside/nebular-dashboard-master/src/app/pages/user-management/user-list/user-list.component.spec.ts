import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserListComponent } from './user-list.component';
import { UserManagementService } from '../user-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NbCardModule, NbLayoutModule, NbStatusService } from '@nebular/theme';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NbCardModule,
        NbLayoutModule
      ],
      declarations: [UserListComponent],
      providers: [
        UserManagementService,
        NbStatusService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
