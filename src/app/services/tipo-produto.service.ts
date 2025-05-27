import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { TipoProduto } from '../model/TipoProduto';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TipoProdutoService {
  constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<TipoProduto[]> {
    return this.http
      .get<{ content: TipoProduto[] }>(
        `${API_CONFIG.baseUrl}/tiposprodutos?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: TipoProduto[]; totalElements: number }> {
    return this.http.get<{ content: TipoProduto[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/tiposprodutos?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<TipoProduto[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allTipos: TipoProduto[] = [];

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

  findById(id: any): Observable<TipoProduto> {
    return this.http.get<TipoProduto>(
      `${API_CONFIG.baseUrl}/tiposprodutos/${id}`
    );
  }

  create(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.post<TipoProduto>(
      `${API_CONFIG.baseUrl}/tiposprodutos`,
      tipo
    );
  }

  update(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.put<TipoProduto>(
      `${API_CONFIG.baseUrl}/tiposprodutos/${tipo.id}`,
      tipo
    );
  }

  delete(id: any): Observable<TipoProduto> {
    return this.http.delete<TipoProduto>(
      `${API_CONFIG.baseUrl}/tiposprodutos/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    descricao?: string;
  }): Observable<{ content: TipoProduto[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/tiposprodutos?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    return this.http.get<{
      content: TipoProduto[];
      page: { totalElements: number };
    }>(url);
  }
}
