import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaCreateComponent } from './venda-create.component';

describe('VendaCreateComponent', () => {
  let component: VendaCreateComponent;
  let fixture: ComponentFixture<VendaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
