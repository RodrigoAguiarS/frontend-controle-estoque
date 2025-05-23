import { Component } from '@angular/core';
import { TipoProduto } from '../../model/TipoProduto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { AlertaService } from '../../../services/alerta.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-tipo-produto-list',
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzAlertModule,
    NzPopconfirmModule,
    NzModalModule,
  ],
  templateUrl: './tipo-produto-list.component.html',
  styleUrl: './tipo-produto-list.component.css'
})
export class TipoProdutoListComponent {

  tipos: TipoProduto[] = [];
  filtroForm!: FormGroup;
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly tipoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      descricao: [''],
      margemLucro: [''],
    });
    this.alertaService.limparAlerta();
  }

  buscarStatus(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() ?? '',
      margemLucro:
        this.filtroForm.get('margemLucro')?.value.trim().toLowerCase() ?? '',
    };
    this.tipoService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.tipos = response.content;
        console.log(response);
        this.nenhumResultadoEncontrado = this.tipos.length === 0;
        this.totalElementos = response.page.totalElements;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.mostrarAlerta(
            'success',
            'Tipo de Produto carrregados com sucesso.'
          );
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
    this.buscarStatus();
  }
}
