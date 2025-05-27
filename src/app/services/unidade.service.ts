import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { Unidade } from '../model/Unidade';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {

  constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<Unidade[]> {
    return this.http
      .get<{ content: Unidade[] }>(
        `${API_CONFIG.baseUrl}/unidades?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: Unidade[]; totalElements: number }> {
    return this.http.get<{ content: Unidade[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/unidades?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<Unidade[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allTipos: Unidade[] = [];

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

  findById(id: any): Observable<Unidade> {
    return this.http.get<Unidade>(
      `${API_CONFIG.baseUrl}/unidades/${id}`
    );
  }

  create(tipo: Unidade): Observable<Unidade> {
    return this.http.post<Unidade>(
      `${API_CONFIG.baseUrl}/unidades`,
      tipo
    );
  }

  update(tipo: Unidade): Observable<Unidade> {
    return this.http.put<Unidade>(
      `${API_CONFIG.baseUrl}/unidades/${tipo.id}`,
      tipo
    );
  }

  delete(id: any): Observable<Unidade> {
    return this.http.delete<Unidade>(
      `${API_CONFIG.baseUrl}/unidades/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    empresa?: number;
  }): Observable<{ content: Unidade[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/unidades?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.empresa) {
      url += `&empresa=${encodeURIComponent(params.empresa)}`;
    }

    return this.http.get<{
      content: Unidade[];
      page: { totalElements: number };
    }>(url);
  }
}
