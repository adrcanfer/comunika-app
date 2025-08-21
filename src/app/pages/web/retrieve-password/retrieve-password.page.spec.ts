import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrievePasswordPage } from './retrieve-password.page';

describe('RetrievePasswordPage', () => {
  let component: RetrievePasswordPage;
  let fixture: ComponentFixture<RetrievePasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
