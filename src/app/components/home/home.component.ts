import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChartType } from 'chart.js';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ProdutoLucroResponse } from '../../model/ProdutoLucroResponse';
import { TipoProdutoEstoqueResponse } from '../../model/TipoProdutoEstoqueResponse';
import { AppChartComponent } from '../chart/chart.component';
import { GraficoService } from '../../services/grafico.service';
import { MovimentacaoResponse } from '../../model/MovimentacaoResponse';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NzSpinModule,
    NzStatisticModule,
    NzButtonModule,
    NzCardModule,
    NzListModule,
    NzAvatarModule,
    NzTableModule,
    NzTagModule,
    NzTimelineModule,
    NzEmptyModule,
    NgChartsModule,
    AppChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  carregando = false;
  ultimasMovimentacoes: MovimentacaoResponse[] = [];
  carregandoMovimentacoes = false;
  public revenueChartOptions = {
    responsive: true,
  };
  public revenueChartLabels: string[] = [];
  public revenueChartType: ChartType = 'line';
  public revenueChartLegend = true;
  public revenueChartData: {
    data: number[];
    label: string;
  }[] = [];

  // Configurações para o gráfico de estoque por tipo
  public stockChartOptions = {
    responsive: true,
  };
  public stockChartLabels: string[] = [];
  public stockChartType: ChartType = 'bar';
  public stockChartLegend = true;
  public stockChartData: {
    data: number[];
    label: string;
    backgroundColor?: string[];
  }[] = [];


  constructor(
    private readonly message: NzMessageService,
    private readonly graficoService: GraficoService
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.carregarDadosFaturamento();
    this.carregarDadosEstoque();
    this.carregarUltimasMovimentacoes();
  }

  private carregarDadosFaturamento(): void {
    this.graficoService.getFaturamentoPorProduto().subscribe({
      next: (data: ProdutoLucroResponse[]) => {
        this.revenueChartLabels = data.map((item) => item.descricaoProduto);
        this.revenueChartData = [
          {
            data: data.map((item) => item.quantidadeSaida),
            label: 'Quantidade Vendida',
          },
          {
            data: data.map((item) => item.totalLucro),
            label: 'Margem de Lucro',
          },
        ];
        this.carregando = false;
      },
      error: () => {
        this.message.error('Erro ao carregar dados.');
        this.carregando = false;
      },
      complete: () => {},
    });
  }

  private carregarDadosEstoque(): void {
    this.graficoService.getEstoquePorTipoProduto().subscribe({
      next: (data: TipoProdutoEstoqueResponse[]) => {
        this.stockChartLabels = data.map((item) => item.tipoProduto);
        this.stockChartData = [
          {
            data: data.map((item) => item.quantidadeSaida),
            label: 'Saídas',
            backgroundColor: this.gerarCores(data.length, 0.7),
          },
          {
            data: data.map((item) => item.quantidadeDisponivel),
            label: 'Disponível em Estoque',
            backgroundColor: this.gerarCores(data.length, 0.5, 30),
          },
        ];
        this.carregando = false;
      },
      error: () => {
        this.message.error('Erro ao carregar dados de estoque.');
        this.carregando = false;
      },
    });
  }

  private carregarUltimasMovimentacoes(): void {
    this.carregandoMovimentacoes = true;
    this.graficoService.getUltimasMovimentacoes().subscribe({
      next: (data: MovimentacaoResponse[]) => {
        this.ultimasMovimentacoes = data;
        this.carregandoMovimentacoes = false;
      },
      error: () => {
        this.message.error('Erro ao carregar últimas movimentações.');
        this.carregandoMovimentacoes = false;
      },
    });
  }

  private gerarCores(
    quantidade: number,
    opacidade: number,
    matizBase: number = 200
  ): string[] {
    const cores: string[] = [];
    for (let i = 0; i < quantidade; i++) {
      const hue = (matizBase + i * 30) % 360;
      cores.push(`hsla(${hue}, 70%, 60%, ${opacidade})`);
    }
    return cores;
  }
}
