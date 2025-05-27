import { Injectable } from '@angular/core';
import { ProdutoLucroResponse } from '../model/ProdutoLucroResponse';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { TipoProdutoEstoqueResponse } from '../model/TipoProdutoEstoqueResponse';
import { MovimentacaoResponse } from '../model/MovimentacaoResponse';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  constructor(private readonly http: HttpClient) {}

    getFaturamentoPorProduto(): Observable<ProdutoLucroResponse[]> {
    return this.http.get<ProdutoLucroResponse[]>(
      `${API_CONFIG.baseUrl}/graficos/lucro-por-produto`
    );
  }

  getEstoquePorTipoProduto(): Observable<TipoProdutoEstoqueResponse[]> {
    return this.http.get<TipoProdutoEstoqueResponse[]>(
      `${API_CONFIG.baseUrl}/graficos/estoque-por-tipo`
    );
  }

  getUltimasMovimentacoes(): Observable<MovimentacaoResponse[]> {
    return this.http.get<MovimentacaoResponse[]>(
      `${API_CONFIG.baseUrl}/graficos/ultimas-movimentacoes`
    );
  }
}
