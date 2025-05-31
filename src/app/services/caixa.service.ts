import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaixaInfo } from '../model/CaixaInfo';
import { API_CONFIG } from '../config/api.config';

interface CaixaForm {
  valor: number;
  observacao?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CaixaService {
  constructor(private readonly http: HttpClient) {}

  getCaixaInfo(): Observable<CaixaInfo> {
    return this.http.get<CaixaInfo>(`${API_CONFIG.baseUrl}/graficos/caixa/info`);
  }

  abrirCaixa(caixaForm: CaixaForm): Observable<void> {
    return this.http.post<void>(
      `${API_CONFIG.baseUrl}/caixas/abrir`,
      caixaForm
    );
  }

  fecharCaixa(caixaId: number, observacao?: string): Observable<void> {
    return this.http.post<void>(
      `${API_CONFIG.baseUrl}/caixas/${caixaId}/fechar`,
      { observacao }
    );
  }

  retirarValorCaixa(
    caixaId: number,
    caixaForm: CaixaForm
  ): Observable<void> {
    return this.http.post<void>(
      `${API_CONFIG.baseUrl}/caixas/${caixaId}/retirar`,
      caixaForm
    );
  }
}
