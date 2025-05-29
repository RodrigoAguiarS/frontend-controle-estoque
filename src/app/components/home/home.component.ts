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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CaixaInfo } from '../../model/CaixaInfo';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { VendasPorUnidadeResponse } from '../../model/VendasPorUnidadeResponse';
import { VendasPorFormaPagamentoResponse } from '../../model/VendasPorFormaPagamentoResponse';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NzSpinModule,
    NzStatisticModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzListModule,
    NzAvatarModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzProgressModule,
    NzTimelineModule,
    NzEmptyModule,
    NzDividerModule,
    NgChartsModule,
    AppChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  caixaInfo: CaixaInfo = {
    id: 0,
    valorAtual: 0,
    valorEntrada: 0,
    valorSaida: 0,
    dataAbertura: '',
    ativo: false,
  };
  vendasPorUnidades!: VendasPorUnidadeResponse[];
  vendasPorFormasDePagamento!: VendasPorFormaPagamentoResponse[];

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

  public paymentChartOptions = {
    responsive: true,
  };
  public paymentChartLabels: string[] = [];
  public paymentChartType: ChartType = 'pie';
  public paymentChartLegend = true;
  public paymentChartData: {
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
    this.carregarDadosDoCaixa();
    this.carregarVendasPorUnidade();
    this.carregarVendasPorFormaPagamentoResponse();
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

  unidadeCores: string[] = [
    '#1890ff',
    '#52c41a',
    '#faad14',
    '#722ed1',
    '#13c2c2',
    '#f5222d',
    '#eb2f96',
    '#fa8c16',
    '#a0d911',
    '#1890ff',
  ];

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

  carregarDadosDoCaixa() {
    this.carregando = true;

    this.graficoService.getObterInformacoesCaixa().subscribe({
      next: (dados) => {
        this.caixaInfo = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar dados do caixa', erro);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  carregarVendasPorUnidade() {
    this.carregando = true;
    this.graficoService.getObterVendasPorUnidadeResponse().subscribe({
      next: (dados) => {
        this.vendasPorUnidades = dados;
        console.log('Vendas por unidade:', this.vendasPorUnidades);
        this.vendasPorUnidades.sort((a, b) => b.valorTotal - a.valorTotal);
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar vendas por unidade', erro);
        this.message.error('Não foi possível carregar os dados de vendas');
        this.carregando = false;
      },
    });
  }

  carregarVendasPorFormaPagamentoResponse() {
    this.carregando = true;

    this.graficoService.getObterVendasPorFormaPagamento().subscribe({
      next: (dados) => {
        console.log('Vendas por forma de pagamento:', dados);
        this.vendasPorFormasDePagamento = dados;
        if (dados && dados.length > 0) {
          this.paymentChartLabels = dados.map((item) => item.formaPagamento);
          const cores = this.gerarCoresGrafico(dados.length);
          this.paymentChartData = [
            {
              data: dados.map((item) => item.valorTotal),
              label: 'Valor Total',
              backgroundColor: cores,
            },
          ];
        }

        this.carregando = false;
      },
      error: (erro) => {
        this.message.error('Falha ao carregar dados de pagamentos');
        this.carregando = false;
      },
    });
  }

  private gerarCoresGrafico(quantidade: number): string[] {
    const cores: string[] = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ];

    const coresCompletas = [];
    for (let i = 0; i < quantidade; i++) {
      coresCompletas.push(cores[i % cores.length]);
    }

    return coresCompletas;
  }

  onPeriodoChange() {
    this.carregarVendasPorUnidade();
  }

  calcularTotalVendas(): number {
    return this.vendasPorUnidades.reduce(
      (total, unidade) => total + unidade.valorTotal,
      0
    );
  }

  calcularPorcentagem(valor: number): number {
    const total = this.calcularTotalVendas();
    if (total === 0) return 0;
    return Math.round((valor / total) * 100);
  }

  getUnitColor(index: number): string {
    return this.unidadeCores[index % this.unidadeCores.length];
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
