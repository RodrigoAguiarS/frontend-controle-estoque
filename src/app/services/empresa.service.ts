import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa } from '../model/Empresa';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

    constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<Empresa[]> {
    return this.http
      .get<{ content: Empresa[] }>(
        `${API_CONFIG.baseUrl}/empresas?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: Empresa[]; totalElements: number }> {
    return this.http.get<{ content: Empresa[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/empresas?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<Empresa[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allTipos: Empresa[] = [];

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

  findById(id: any): Observable<Empresa> {
    return this.http.get<Empresa>(
      `${API_CONFIG.baseUrl}/empresas/${id}`
    );
  }

  create(tipo: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(
      `${API_CONFIG.baseUrl}/empresas`,
      tipo
    );
  }

  update(tipo: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(
      `${API_CONFIG.baseUrl}/empresas/${tipo.id}`,
      tipo
    );
  }

  delete(id: any): Observable<Empresa> {
    return this.http.delete<Empresa>(
      `${API_CONFIG.baseUrl}/empresas/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    cnpj?: string;
  }): Observable<{ content: Empresa[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/empresas?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.cnpj) {
      url += `&cnpj=${encodeURIComponent(params.cnpj)}`;
    }

    return this.http.get<{
      content: Empresa[];
      page: { totalElements: number };
    }>(url);
  }
}
