import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormaDePagamento } from '../model/FormaDePagamento';
import { API_CONFIG } from '../config/api.config';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaDePagamentoService {

  constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<FormaDePagamento[]> {
    return this.http
      .get<{ content: FormaDePagamento[] }>(
        `${API_CONFIG.baseUrl}/formaDePagamento?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: FormaDePagamento[]; totalElements: number }> {
    return this.http.get<{ content: FormaDePagamento[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/formaDePagamento?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<FormaDePagamento[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allTipos: FormaDePagamento[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap((tipos) => {
        allTipos = allTipos.concat(tipos);
        if (tipos.length < pageSize) {
          return of(allTipos);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap((nextTipos) => {
              allTipos = allTipos.concat(nextTipos);
              return of(allTipos);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<FormaDePagamento> {
    return this.http.get<FormaDePagamento>(
      `${API_CONFIG.baseUrl}/formaDePagamento/${id}`
    );
  }

  create(tipo: FormaDePagamento): Observable<FormaDePagamento> {
    return this.http.post<FormaDePagamento>(
      `${API_CONFIG.baseUrl}/formaDePagamento`,
      tipo
    );
  }

  update(tipo: FormaDePagamento): Observable<FormaDePagamento> {
    return this.http.put<FormaDePagamento>(
      `${API_CONFIG.baseUrl}/formaDePagamento/${tipo.id}`,
      tipo
    );
  }

  delete(id: any): Observable<FormaDePagamento> {
    return this.http.delete<FormaDePagamento>(
      `${API_CONFIG.baseUrl}/formaDePagamento/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    descricao?: string;
    porcentagemAcrescimo?: string;
  }): Observable<{ content: FormaDePagamento[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/formaDePagamento?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    if (params.porcentagemAcrescimo) {
      url += `&porcentagemAcrescimo=${encodeURIComponent(params.porcentagemAcrescimo)}`;
    }

    return this.http.get<{
      content: FormaDePagamento[];
      page: { totalElements: number };
    }>(url);
  }
}
