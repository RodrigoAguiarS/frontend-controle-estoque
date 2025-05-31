import { Component } from '@angular/core';
import { Perfil } from '../../../model/Perfil';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilService } from '../../../services/perfil.service';
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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-perfil-list',
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
    NzModalModule,
    NzAlertModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './perfil-list.component.html',
  styleUrl: './perfil-list.component.css',
})
export class PerfilListComponent {
  perfis: Perfil[] = [];
  filtroForm!: FormGroup;
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      descricao: [''],
    });
    this.alertaService.limparAlerta();
    this.carregarPerfis();
  }

  carregarPerfis(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() ?? '',
    };
    this.perfilService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.perfis = response.content;
        this.nenhumResultadoEncontrado = this.perfis.length === 0;
        this.totalElementos = response.page.totalElements;
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
    this.carregarPerfis();
  }
}
