import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormadepagamentoUpdateComponent } from './formadepagamento-update.component';

describe('FormadepagamentoUpdateComponent', () => {
  let component: FormadepagamentoUpdateComponent;
  let fixture: ComponentFixture<FormadepagamentoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormadepagamentoUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormadepagamentoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
