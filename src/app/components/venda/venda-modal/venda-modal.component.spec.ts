import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaModalComponent } from './venda-modal.component';

describe('VendaModalComponent', () => {
  let component: VendaModalComponent;
  let fixture: ComponentFixture<VendaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
