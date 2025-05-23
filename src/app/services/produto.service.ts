import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../model/Produto';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private readonly http: HttpClient) {}

  findById(id: any): Observable<Produto> {
    return this.http.get<Produto>(`${API_CONFIG.baseUrl}/produtos/${id}`);
  }

  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${API_CONFIG.baseUrl}/produtos`, produto);
  }

  update(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(
      `${API_CONFIG.baseUrl}/produtos/${produto.id}`,
      produto
    );
  }

  delete(id: any): Observable<Produto> {
    return this.http.delete<Produto>(`${API_CONFIG.baseUrl}/produtos/${id}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    descricao?: string;
    valorFornecedor?: number;
    quantidadeEstoque?: number;
    tipoProdutoId?: string;
  }): Observable<{ content: Produto[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/produtos/buscar?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${encodeURIComponent(params.id)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    if (params.valorFornecedor) {
      url += `&valorFornecedor=${encodeURIComponent(params.valorFornecedor)}`;
    }

    if (params.quantidadeEstoque) {
      url += `&quantidadeEstoque=${encodeURIComponent(
        params.quantidadeEstoque
      )}`;
    }

    if (params.tipoProdutoId) {
      url += `&tipoProdutoId=${encodeURIComponent(params.tipoProdutoId)}`;
    }

    return this.http.get<{ content: Produto[]; page: { totalElements: number } }>(url);
  }

  removerArquivo(arquivoUrl: string): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.baseUrl}/s3/apagar/${arquivoUrl}`
    );
  }
}
