import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormadepagamentoDeleteComponent } from './formadepagamento-delete.component';

describe('FormadepagamentoDeleteComponent', () => {
  let component: FormadepagamentoDeleteComponent;
  let fixture: ComponentFixture<FormadepagamentoDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormadepagamentoDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormadepagamentoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
