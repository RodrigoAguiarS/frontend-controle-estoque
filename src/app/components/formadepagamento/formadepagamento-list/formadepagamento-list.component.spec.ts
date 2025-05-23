import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormadepagamentoListComponent } from './formadepagamento-list.component';

describe('FormadepagamentoListComponent', () => {
  let component: FormadepagamentoListComponent;
  let fixture: ComponentFixture<FormadepagamentoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormadepagamentoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormadepagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
