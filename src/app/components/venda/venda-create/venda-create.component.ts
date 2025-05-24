import { Component } from '@angular/core';
import { ItemVenda } from '../../../model/ItemVenda';
import { ProdutoService } from '../../../services/produto.service';
import { FormaDePagamentoService } from '../../../services/forma-de-pagamento.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { Produto } from '../../../model/Produto';
import { FormaDePagamento } from '../../../model/FormaDePagamento';
import { Venda } from '../../../model/Venda';
import { CarrinhoService } from '../../../services/carrinho.service';
import { VendaService } from '../../../services/venda.service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venda-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzBadgeModule,
    NzAutocompleteModule,
    NzModalModule,
    NzCardModule,
    NzTableModule,
    NzDrawerModule,
    NzListModule,
    NzSelectModule,
    NzFormModule,
  ],
  templateUrl: './venda-create.component.html',
  styleUrl: './venda-create.component.css',
})
export class VendaCreateComponent {
  pdvForm!: FormGroup;
  valorParcial = 0;
  taxaPagamento = 0;
  valorTotal = 0;
  acrescimo = 0;
  drawerVisible = false;
  showAutocomplete = false;
  today = new Date();

  produtos: Produto[] = [];
  pagamentos: FormaDePagamento[] = [];

  produtosAutocomplete: (string | number)[] = [];
  clientesAutocomplete: (string | number)[] = [];

  produtoMap: Map<string, Produto> = new Map();

  itensCarrinho: ItemVenda[] = [];

  produtoSelecionado: Produto | null = null;
  formaPagamentoLabel: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly mensagemService: NzMessageService,
    private readonly carrinhoService: CarrinhoService,
    private readonly produtoService: ProdutoService,
    private readonly pedidoService: VendaService,
    private readonly router: Router,
    private readonly pagamentoService: FormaDePagamentoService,
    private readonly modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosIniciais();
    this.observarItensCarrinho();
  }

  private inicializarFormulario(): void {
    this.pdvForm = this.fb.group({
      produto: [''],
      pagamento: ['', Validators.required],
      itens: [[], Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
    });
    this.pdvForm
      .get('pagamento')
      ?.valueChanges.subscribe((value: FormaDePagamento) => {
        if (value) {
          this.formaPagamentoLabel = value.nome || '';
          this.acrescimo = value.porcentagemAcrescimo || 0;
          this.atualizarValores();
        }
      });
  }

  private carregarDadosIniciais(): void {
    this.carregarPagamentos();
  }

  private observarItensCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.carrinhoService.itensCarrinho$.subscribe((itens) => {
      this.itensCarrinho = itens;
      this.pdvForm.get('itens')?.setValue(itens);
      this.atualizarValores();
    });
  }

  private carregarPagamentos(): void {
    this.pagamentoService.findAll().subscribe((resposta) => {
      this.pagamentos = resposta;
    });
  }

  onInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.produtoMap.clear();

    if (this.produtos.length === 0) {
      this.produtoService.findAll().subscribe((produtos: Produto[]) => {
        this.produtos = produtos;
        this.filtrarProdutos(value);
      });
    } else {
      this.filtrarProdutos(value);
    }
  }

  private filtrarProdutos(value: string): void {
    if (value.length > 0) {
      this.produtosAutocomplete = this.produtos
        .filter(
          (produto) =>
            produto.descricao.toLowerCase().includes(value) ||
            produto.id.toString().includes(value)
        )
        .map((produto) => {
          this.produtoMap.set(produto.descricao, produto);
          return produto.descricao;
        });
      this.showAutocomplete = true;
    } else {
      this.produtosAutocomplete = [];
      this.showAutocomplete = false;
    }
  }

  selecionarProduto(event: any): void {
    const valorSelecionado = event.nzValue;
    const produtoSelecionado = this.produtos.find(
      (produto) =>
        produto.descricao === valorSelecionado ||
        produto.id.toString() === valorSelecionado
    );
    if (produtoSelecionado) {
      this.produtoSelecionado = produtoSelecionado;
      const nomeProdutoFormatado = `${
        produtoSelecionado.descricao
      } - ${produtoSelecionado.valorVenda.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`;
      this.pdvForm.get('produto')?.setValue(nomeProdutoFormatado);
    } else {
      this.pdvForm.get('produto')?.setValue('');
    }
  }

  aumentarQuantidade(produto: Produto) {
    this.carrinhoService.adicionarProduto(produto, 1);
    this.atualizarValores();
  }

  diminuirQuantidade(produto: Produto) {
    this.carrinhoService.diminuirQuantidade(produto.id, 1);
    this.atualizarValores();
  }

  removerItem(produtoId: number) {
    this.carrinhoService.removerProduto(produtoId);
    this.atualizarValores();
  }

  adicionarAoCarrinho(): void {
    const quantidade = this.pdvForm.get('quantidade')?.value;
    if (this.produtoSelecionado) {
      this.carrinhoService.adicionarProduto(
        this.produtoSelecionado,
        quantidade
      );
      this.atualizarValores();
      this.produtoSelecionado = null;
      this.pdvForm.get('produto')?.setValue('');
      this.pdvForm.get('quantidade')?.reset(1);
    } else {
      this.mensagemService.error(
        'Selecione um produto para adicionar ao carrinho.'
      );
    }
  }

  realizarVenda(): void {
    this.modalService.confirm({
      nzTitle: 'Confirmação de Venda',
      nzContent: 'Você tem certeza que deseja realizar esta venda?',
      nzOnOk: () => this.confirmarVenda(),
    });
  }

  private confirmarVenda(): void {
    this.atualizarFormulario();

    if (this.pdvForm.valid) {
      const pedido: Venda = {
        id: 0,
        itens: this.itensCarrinho,
        valorTotal: this.valorTotal,
        criadoEm: new Date().toISOString(),
        formaDePagamento: this.pdvForm.value.pagamento.id,
      };

      this.pedidoService.create(pedido).subscribe({
        next: (resposta) => {
          this.mensagemService.success(
            'Pedido realizado no valor de R$ ' +
              resposta.valorTotal +
              ' com sucesso!'
          );
          this.resetForm();
        },
        error: (ex) => {
          this.mensagemService.error(ex.error.message);
          this.resetForm();
        },
      });
    } else {
      this.mensagemService.error('Formulário inválido!');
    }
  }

  private atualizarFormulario(): void {
    this.pdvForm.get('itens')?.setValue(this.itensCarrinho);
    this.pdvForm.get('produto')?.setValue(this.produtoSelecionado);
  }

  resetForm(): void {
    this.pdvForm.reset();
    this.pdvForm.get('quantidade')?.reset(1);
    this.carrinhoService.limparCarrinho();
    this.produtoSelecionado = null;
    this.valorParcial = 0;
    this.valorTotal = 0;
    this.acrescimo = 0;
    this.taxaPagamento = 0;
  }

  private atualizarValores() {
    this.valorParcial = +this.itensCarrinho
      .reduce(
        (total, item) => total + item.produto.valorVenda * item.quantidade,
        0
      )
      .toFixed(2);
    this.taxaPagamento = +((this.valorParcial * this.acrescimo) / 100).toFixed(
      2
    );
    this.valorTotal = +(
      this.valorParcial +
      (this.valorParcial * this.acrescimo) / 100
    ).toFixed(2);
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  handleKeyPress(event: KeyboardEvent, produto: Produto): void {
    console.log('KeyPress event:', event);
  }

  handleKeyDown(event: KeyboardEvent, produto: Produto): void {
    console.log('KeyDown event:', event);
  }

  handleKeyUp(event: KeyboardEvent, produto: Produto): void {
    console.log('KeyUp event:', event);
  }
}
