import { Injectable } from '@angular/core';
import { ProdutoLucroResponse } from '../model/ProdutoLucroResponse';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { TipoProdutoEstoqueResponse } from '../model/TipoProdutoEstoqueResponse';
import { MovimentacaoResponse } from '../model/MovimentacaoResponse';
import { CaixaInfo } from '../model/CaixaInfo';
import { VendasPorFormaPagamentoResponse } from '../model/VendasPorFormaPagamentoResponse';
import { VendasPorUnidadeResponse } from '../model/VendasPorUnidadeResponse';

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

  getObterInformacoesCaixa(): Observable<CaixaInfo> {
    return this.http.get<CaixaInfo>(
      `${API_CONFIG.baseUrl}/graficos/caixa/info`
    );
  }

  getObterVendasPorFormaPagamento(): Observable<VendasPorFormaPagamentoResponse[]> {
    return this.http.get<VendasPorFormaPagamentoResponse[]>(
      `${API_CONFIG.baseUrl}/graficos/vendas-por-forma-pagamento`
    );
  }

  getObterVendasPorUnidadeResponse(): Observable<VendasPorUnidadeResponse[]> {
    return this.http.get<VendasPorUnidadeResponse[]>(
      `${API_CONFIG.baseUrl}/graficos/vendas-por-unidade`
    );
  }
}
