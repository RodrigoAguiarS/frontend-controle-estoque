import { TestBed } from '@angular/core/testing';

import { FormaDePagamentoService } from './forma-de-pagamento.service';

describe('FormaDePagamentoService', () => {
  let service: FormaDePagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormaDePagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
