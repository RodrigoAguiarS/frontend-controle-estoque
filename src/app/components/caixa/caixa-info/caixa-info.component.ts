import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CaixaInfo } from '../../../model/CaixaInfo';
import { CaixaService } from '../../../services/caixa.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Venda } from '../../../model/Venda';
import { VendaService } from '../../../services/venda.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ModalAberturaCaixaComponent } from '../caixa-modal/caixa-modal.component';
import { VendaModalComponent } from '../../venda/venda-modal/venda-modal.component';

@Component({
  selector: 'app-caixa-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSpinModule,
    NzIconModule,
    NzPaginationModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
  ],
  templateUrl: './caixa-info.component.html',
  styleUrl: './caixa-info.component.css',
})
export class CaixaInfoComponent implements OnInit {
  caixaForm: FormGroup;
  vendasCaixa: Venda[] = [];
  carregandoVendas: boolean = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  confirmModal?: NzModalRef;

  caixaInfo: CaixaInfo = {
    id: 0,
    valorAtual: 0,
    valorInicial: 0,
    valorEntrada: 0,
    valorSaida: 0,
    dataAbertura: '',
    ativo: false,
  };

  carregando: boolean = false;

  constructor(
    private readonly caixaService: CaixaService,
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private readonly vendaService: VendaService,
    private readonly message: NzMessageService
  ) {
    this.caixaForm = this.fb.group({
      valor: [0, [Validators.required, Validators.min(0.01)]],
      observacao: [''],
    });
  }

  ngOnInit(): void {
    this.carregarCaixaInfo();
  }

  carregarCaixaInfo(): void {
    this.carregando = true;
    this.caixaService.getCaixaInfo().subscribe({
      next: (caixaInfo) => {
        this.caixaInfo = caixaInfo;
        this.carregando = false;
        if (caixaInfo.ativo) {
          this.carregarVendasDoCaixa(caixaInfo.id);
        } else {
          this.vendasCaixa = [];
          this.totalElementos = 0;
        }
      },
      error: () => {
        this.message.error('Não foi possível carregar informações do caixa');
        this.carregando = false;
      },
      complete: () => {
        this.resetForm();
      },
    });
  }

  carregarVendasDoCaixa(caixa: number): void {
    this.carregandoVendas = true;

    this.vendaService
      .buscarPaginado({
        page: this.paginaAtual - 1,
        size: this.itensPorPagina,
        caixa: caixa,
        sort: 'id',
      })
      .subscribe({
        next: (response) => {
          this.vendasCaixa = response.content;
          this.totalElementos = response.page.totalElements;
          this.carregandoVendas = false;
        },
        error: () => {
          this.carregandoVendas = false;
          this.message.error('Não foi possível carregar as vendas deste caixa');
        },
        complete: () => {
          this.carregandoVendas = false;
        },
      });
  }

  calcularTotalVendas(): number {
    if (!this.vendasCaixa || this.vendasCaixa.length === 0) {
      return 0;
    }
    return this.vendasCaixa
      .filter((venda) => venda.ativo)
      .reduce((total, venda) => total + (venda.valorTotal ?? 0), 0);
  }

  abrirCaixa(): void {
    if (this.caixaInfo.ativo) {
      this.message.warning('Já existe um caixa aberto');
      return;
    }

     const modalRef = this.modal.create({
      nzTitle: 'Abertura de Caixa',
      nzContent: ModalAberturaCaixaComponent,
      nzFooter: null,
      nzWidth: 500,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {
        titulo: 'Adicionar Valor',
        labelValor: 'Valor de entrada',
        valorMaximo: this.caixaInfo.valorAtual,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.carregando = true;
        this.caixaService.abrirCaixa(result).subscribe({
          next: () => {
            this.message.success('Caixa aberto com sucesso!');
            this.carregarCaixaInfo();
          },
          error: (error) => {
            this.message.error('Não foi possível abrir o caixa');
            this.carregando = false;
          },
          complete: () => {
            this.resetForm();
            this.carregando = false;
          },
        });
      }
    });
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.carregarVendasDoCaixa(this.caixaInfo.id);
  }

  fecharCaixa(): void {
    if (!this.caixaInfo.id || !this.caixaInfo.ativo) {
      console.log(this.caixaInfo);
      this.message.warning('Não há caixa aberto para fechar');
      return;
    }
    this.carregando = true;
    const observacao = this.caixaForm.get('observacao')?.value;
    this.caixaService.fecharCaixa(this.caixaInfo.id, observacao).subscribe({
      next: () => {
        this.message.success('Caixa fechado com sucesso!');
        this.carregarCaixaInfo();
      },
      error: (error) => {
        this.message.error('Não foi possível fechar o caixa');
        this.carregando = false;
      },
      complete: () => {
        this.resetForm();
        this.carregando = false;
      },
    });
  }

  retirarValor(): void {
    if (!this.caixaInfo.id || !this.caixaInfo.ativo) {
      this.message.warning('Não há caixa aberto para realizar retiradas');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: 'Retirada de Valor',
      nzContent: ModalAberturaCaixaComponent,
      nzFooter: null,
      nzWidth: 500,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {
        titulo: 'Retirada de Valor',
        labelValor: 'Valor a Retirar',
        valorMaximo: this.caixaInfo.valorAtual,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        if (result.valor > this.caixaInfo.valorAtual) {
          this.message.error(
            'Valor de retirada maior que o disponível no caixa'
          );
          return;
        }
        this.carregando = true;
        this.caixaService
          .retirarValorCaixa(this.caixaInfo.id, result)
          .subscribe({
            next: () => {
              this.message.success('Retirada realizada com sucesso!');
              this.carregarCaixaInfo();
            },
            error: (error) => {
              this.message.error('Não foi possível realizar a retirada');
              this.carregando = false;
            },
            complete: () => {
              this.carregando = false;
            },
          });
      }
    });
  }

  cancelarVenda(idVenda: number): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Confirmar cancelamento',
      nzContent:
        'Tem certeza que deseja cancelar esta venda? Esta ação não pode ser desfeita.',
      nzOkText: 'Sim, cancelar venda',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.carregando = true;
        this.vendaService.cancelarVenda(idVenda).subscribe({
          next: () => {
            this.message.success('Venda cancelada com sucesso!');
            this.carregarVendasDoCaixa(this.caixaInfo.id);
          },
          error: (error) => {
            this.message.error(
              'Não foi possível cancelar a venda. Tente novamente mais tarde.'
            );
          },
          complete: () => {
            this.carregando = false;
          },
        });
      },
    });
  }

  gerarCupomVenda(vendaId: number): void {
    this.carregando = true;
    this.vendaService.gerarCupomVenda(vendaId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cupom-venda-${vendaId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao gerar o cupom:', error);
        this.carregando = false;
        this.message.error('Erro ao gerar o cupom da venda');
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  abrirModalVenda(venda: Venda): void {
    this.carregando = true;
    this.vendaService.findById(venda.id).subscribe({
      next: (vendaDetalhada) => {
        const modal = this.modal.create({
          nzTitle: `Detalhes da Venda #${venda.id}`,
          nzContent: VendaModalComponent,
          nzWidth: '800px',
          nzFooter: [
            {
              label: 'Fechar',
              onClick: () => modal.destroy(),
            },
            {
              label: 'Gerar Cupom',
              type: 'primary',
              onClick: () => {
                this.gerarCupomVenda(venda.id);
                return true;
              },
            },
          ],
          nzMaskClosable: true,
          nzClassName: 'venda-detalhes-modal',
        });

        const instance = modal.getContentComponent();
        if (instance) {
          instance.venda = vendaDetalhada || venda;
        }

        this.carregando = false;
      },
      error: () => {
        this.message.error('Não foi possível carregar os detalhes da venda.');
        this.carregando = false;
      },
    });
  }

  resetForm(): void {
    this.caixaForm.reset({
      valor: 0,
      observacao: '',
    });
  }
}
