import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectSourcesPage } from './select-sources.page';

describe('SelectSourcesPage', () => {
  let component: SelectSourcesPage;
  let fixture: ComponentFixture<SelectSourcesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSourcesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
