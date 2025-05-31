import { Component } from '@angular/core';
import { Venda } from '../../../model/Venda';
import { FormaDePagamento } from '../../../model/FormaDePagamento';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { VendaService } from '../../../services/venda.service';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormaDePagamentoService } from '../../../services/forma-de-pagamento.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertaService } from '../../../services/alerta.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgxCurrencyDirective } from 'ngx-currency';
import { VendaModalComponent } from '../venda-modal/venda-modal.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-venda-list',
  imports: [
    CommonModule,
    NzInputNumberModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzSpinModule,
    NgxCurrencyDirective,
    NzPaginationModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzTagModule,
  ],
  templateUrl: './venda-list.component.html',
  styleUrl: './venda-list.component.css',
})
export class VendaListComponent {
  vendas: Venda[] = [];
  pagamentos: FormaDePagamento[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  filtroForm: FormGroup;
  nenhumResultadoEncontrado = false;
  confirmModal?: NzModalRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly vendaService: VendaService,
    private readonly modal: NzModalService,
    private readonly pagamentoService: FormaDePagamentoService,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {
    this.filtroForm = this.fb.group({
      id: [''],
      formaDePagamentoId: [''],
      valorMinimo: [''],
      valorMaximo: [''],
      dataInicio: [''],
      dataFim: [''],
    });
  }

  ngOnInit(): void {
    this.carregarPagamentos();
    this.findAllVendas();
    this.alertaService.limparAlerta();
  }

  buscarVenda(): void {
    this.paginaAtual = 1;
    this.findAllVendas();
  }

  private findAllVendas() {
    this.carregando = true;

    const formatarData = (data: string | null): string | null => {
      if (!data) return null;
      const date = new Date(data);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(
        2,
        '0'
      )}:${String(date.getSeconds()).padStart(2, '0')}.${String(
        date.getMilliseconds()
      ).padStart(3, '0')}`;
    };

    const params = {
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      sort: 'id',
      caixa: 0, // Assuming 'caixa' is not used in this context
      id: this.filtroForm.get('id')?.value,
      formaDePagamentoId: this.filtroForm.get('formaDePagamentoId')?.value,
      valorMinimo: this.filtroForm.get('valorMinimo')?.value,
      valorMaximo: this.filtroForm.get('valorMaximo')?.value,
      dataInicio:
        formatarData(this.filtroForm.get('dataInicio')?.value) ?? undefined,
      dataFim: formatarData(this.filtroForm.get('dataFim')?.value) ?? undefined,
    };

    this.vendaService.buscarPaginado(params).subscribe({
      next: (data) => {
        this.vendas = data.content;
        this.totalElementos = data.page.totalElements;
        this.nenhumResultadoEncontrado = data.page.totalElements === 0;
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
      error: (e) => {
        this.message.error('Erro ao buscar usuários');
        this.alertaService.mostrarAlerta('error', 'Erro ao buscar usuários.');
        this.carregando = false;
      },
    });
  }

  private carregarPagamentos(): void {
    this.pagamentoService.findAll().subscribe({
      next: (pagamentos) => {
        this.pagamentos = pagamentos;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  aoMudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.findAllVendas();
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
      error: (error) => {
        console.error('Erro ao carregar detalhes da venda:', error);
        this.message.error('Não foi possível carregar os detalhes da venda.');
        this.carregando = false;
      },
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
            this.findAllVendas();
          },
          error: (error) => {
            console.error('Erro ao cancelar venda:', error);
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
}
