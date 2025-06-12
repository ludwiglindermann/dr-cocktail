import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCoctelPage } from './detalle-coctel.page';

describe('DetalleCoctelPage', () => {
  let component: DetalleCoctelPage;
  let fixture: ComponentFixture<DetalleCoctelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCoctelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
