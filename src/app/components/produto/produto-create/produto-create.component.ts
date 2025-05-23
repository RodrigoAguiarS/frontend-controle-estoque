import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoProduto } from '../../model/TipoProduto';
import { API_CONFIG } from '../../../../config/api.config';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { Router } from '@angular/router';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
} from 'ng-zorro-antd/upload';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-produto-create',
    imports: [
    ReactiveFormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzSpinModule,
    NzUploadModule,
    NgxCurrencyDirective,
    NzDatePickerModule,
  ],
  templateUrl: './produto-create.component.html',
  styleUrl: './produto-create.component.css',
})
export class ProdutoCreateComponent {
  produtoForm!: FormGroup;
  tipos: TipoProduto[] = [];
  carregando = false;
  uploadUrl = API_CONFIG.baseUrl + '/s3/upload';
  uploadUrlStorage = API_CONFIG.baseUrl + '/storage/produto/';
  fileList: NzUploadFile[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: ProdutoService,
    private readonly tipoProdutoService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarCategoria();
  }

  criar(): void {
    if (this.produtoForm.valid) {
      const arquivosUrl = this.fileList
        .map((file) => file.url)
        .filter((url) => !!url);
      this.produtoForm.patchValue({ arquivosUrl });
      this.carregando = true;
      this.produtoService.create(this.produtoForm.value).subscribe({
        next: (resposta) => {
          this.router.navigate(['/result'], {
            queryParams: {
              type: 'success',
              title: 'Produto de nome - ' + resposta.descricao,
              message: 'O Produto foi criado com sucesso!',
              createRoute: '/produtos/create',
              listRoute: '/produtos/list',
            },
          });
        },
        error: (ex) => {
          if (ex.error.errors) {
            ex.error.errors.forEach((element: ErrorEvent) => {
              this.message.error(element.message);
              this.carregando = false;
            });
          } else {
            this.message.error(ex.error.message);
            this.carregando = false;
          }
        },
        complete: () => {
          this.carregando = false;
        },
      });
    }
  }

  verificarTamanhoArquivo = (file: NzUploadFile): boolean => {
    const tamanhoMaximoMB = 5;
    const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;
    if ((file.size ?? 0) > tamanhoMaximoBytes) {
      this.message.error(
        `O arquivo ${file.name} excede o limite de ${tamanhoMaximoMB}MB.`
      );
      return false;
    }
    return true;
  };

  private carregarCategoria(): void {
    this.carregando = true;
    this.tipoProdutoService.findAll().subscribe({
      next: (response) => {
        this.tipos = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private initForm(): void {
    this.produtoForm = this.formBuilder.group({
      descricao: ['', Validators.required],
      valorFornecedor: [0, [Validators.required, Validators.min(0)]],
      valorVenda: [0, [Validators.required, Validators.min(0)]],
      quantidadeEstoque: [null, [Validators.required, Validators.min(0)]],
      tipoProdutoId: [null, Validators.required],
      arquivosUrl: [[]],
      ativo: [true, Validators.required],
    });
  }

  aoMudarUpload(event: NzUploadChangeParam): void {
    if (event.file.status === 'done') {
      let response = event.file.response;
      if (typeof response === 'object' && response.url) {
        response = response.url;
      }
      const arquivoUrl = typeof response === 'string' ? response.trim() : '';

      if (arquivoUrl) {
        this.fileList = this.fileList.map((file) => {
          if (file.uid === event.file.uid) {
            return { ...file, url: arquivoUrl };
          }
          return file;
        });
      }
    } else if (event.file.status === 'error') {
      this.message.error('Erro ao fazer upload do arquivo');
    }
  }

  removerArquivo(file: NzUploadFile): Observable<boolean> {
    if (!file.url) {
      return of(false);
    }

    const fileName = file.url.substring(file.url.lastIndexOf('/') + 1);

    return this.produtoService.removerArquivo(fileName).pipe(
      map(() => {
        this.message.success('Arquivo removido com sucesso');
        this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
        return true;
      }),
      catchError((err) => {
        this.message.error('Erro ao remover o arquivo');
        return of(false);
      })
    );
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
