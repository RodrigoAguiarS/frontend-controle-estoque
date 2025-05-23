import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venda } from '../model/Venda';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

    constructor(private readonly http: HttpClient) {}

  create(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(`${API_CONFIG.baseUrl}/vendas`, venda);
  }

  findById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${API_CONFIG.baseUrl}/vendas/${id}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    sort?: string;
    id?: number;
    formaPagamento?: number;
    valorMinimo?: number;
    valorMaximo?: number;
    dataInicio?: string;
    dataFim?: string;
    ativo?: boolean;
  }): Observable<{ content: Venda[]; totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/vendas/buscar?page=${params.page}&size=${params.size}`;

    if (params.sort) {
      url += `&sort=${params.sort}`;
    }

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.formaPagamento) {
      url += `&formaPagamento=${params.formaPagamento}`;
    }

    if (params.valorMinimo) {
      url += `&valorMinimo=${params.valorMinimo}`;
    }

    if (params.valorMaximo) {
      url += `&valorMaximo=${params.valorMaximo}`;
    }

    if (params.dataInicio) {
      url += `&dataInicio=${encodeURIComponent(params.dataInicio)}`;
    }

    if (params.dataFim) {
      url += `&dataFim=${encodeURIComponent(params.dataFim)}`;
    }

    return this.http.get<{ content: Venda[]; totalElements: number }>(url);
  }

  getVendasCliente(params: {
    page: number;
    size: number;
    sort?: string;
  }): Observable<{ content: Venda[]; totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/vendas/meus-pedidos?page=${params.page}&size=${params.size}`;

    if (params.sort) {
      url += `&sort=${encodeURIComponent(params.sort)}`;
    }

    return this.http.get<{ content: Venda[]; totalElements: number }>(url);
  }

  atualizarStatus(
    vendaId: number,
    statusId: number,
    tipoVenda: string
  ): Observable<Venda> {
    return this.http.put<Venda>(
      `${API_CONFIG.baseUrl}/vendas/${vendaId}/status/${statusId}?tipoVenda=${tipoVenda}`,
      {}
    );
  }

  gerarCupomVenda(vendaId: number) {
    const url = `${API_CONFIG.baseUrl}/${vendaId}/cupom`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
