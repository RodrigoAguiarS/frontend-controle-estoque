import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Produto } from '../../../model/Produto';
import { TipoProduto } from '../../../model/TipoProduto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { AlertaService } from '../../../services/alerta.service';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NgxCurrencyDirective } from 'ngx-currency';
@Component({
  selector: 'app-produto-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzTagModule,
    NzPopconfirmModule,
    NzSkeletonModule,
    NgxCurrencyDirective,
    NzModalModule,
    NzAlertModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.css',
})
export class ProdutoListComponent {
  filtroForm!: FormGroup;
  produtos: Produto[] = [];
  tiposProduto: TipoProduto[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';

  produtoSelecionado: Produto = {
    id: 0,
    arquivosUrl: [],
    descricao: '',
    valorFornecedor: 0,
    valorVenda: 0,
    ativo: false,
    tipoProduto: { nome: '', id: 0, descricao: ''},
    quantidadeEstoque: 0,
    dataCriacao: '',
  };

  nenhumResultadoEncontrado = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: ProdutoService,
    private readonly tipoProdutoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarTipoProdutos();
    this.alertaService.limparAlerta();
    this.buscarProduto();
  }

  private initForm(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      descricao: [''],
      valorFornecedor: [0],
      quantidadeEstoque: [null],
      tipoProdutoId: [null],
      arquivosUrl: [[]],
    });
  }

  private carregarTipoProdutos(): void {
    this.tipoProdutoService.findAll().subscribe({
      next: (response) => {
        this.tiposProduto = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  buscarProduto(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() ?? '',
    };
    this.produtoService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.produtos = response.content;
        this.totalElementos = response.page.totalElements;
        this.nenhumResultadoEncontrado = this.produtos.length === 0;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.limparAlerta();
        }
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
    });
  }

  cancel(): void {
    this.message.info('Ação Cancelada');
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarProduto();
  }

  abrirModalProduto(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.modalVisible = true;
  }

  fecharModal(): void {
    this.modalVisible = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }
}
