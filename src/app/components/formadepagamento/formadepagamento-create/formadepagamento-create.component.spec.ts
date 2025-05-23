import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormadepagamentoCreateComponent } from './formadepagamento-create.component';

describe('FormadepagamentoCreateComponent', () => {
  let component: FormadepagamentoCreateComponent;
  let fixture: ComponentFixture<FormadepagamentoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormadepagamentoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormadepagamentoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
