import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TipoProduto } from '../../model/TipoProduto';
import { API_CONFIG } from '../../../../config/api.config';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-produto-update',
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
  templateUrl: './produto-update.component.html',
  styleUrl: './produto-update.component.css',
})
export class ProdutoUpdateComponent {
  produtoForm!: FormGroup;
  tiposProduto: TipoProduto[] = [];
  id!: number;
  carregando = false;
  fileList: NzUploadFile[] = [];
  uploadUrl = API_CONFIG.baseUrl + '/s3/upload';

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: TipoProdutoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carrregarProdutos();
    this.carregarTiposProduto();
  }

  update(): void {
    this.produtoForm.value.id = this.id;
    this.carregando = true;
    this.produtoService.update(this.produtoForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Produto de Título - ' + resposta.descricao,
            message: 'A Produto foi atualizada com sucesso!',
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
    });
  }

  private carrregarProdutos(): void {
    this.produtoService.findById(this.id).subscribe({
      next: (produto) => {
        this.produtoForm.patchValue(produto);
        this.produtoForm.get('tipoProdutoId')?.setValue(produto.tipoProduto.id);
        this.fileList = produto.arquivosUrl.map((url, index) => ({
          uid: `${index}`,
          name: `${url.substring(url.lastIndexOf('/')) + 1}`,
          status: 'done',
          url: url,
        }));
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
      complete: () => {},
    });
  }

  private carregarTiposProduto(): void {
    this.carregando = true;
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.tiposProduto = response;
        this.carregando = false;
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
        const arquivosAtuais = this.produtoForm.get('arquivosUrl')?.value ?? [];
        this.produtoForm.patchValue({
          arquivosUrl: [...arquivosAtuais, arquivoUrl],
        });
        console.log(this.produtoForm.value);
      }
    } else if (event.file.status === 'error') {
      this.message.error('Erro ao fazer upload do arquivo');
    }
  }

  removerArquivo(file: NzUploadFile): Observable<boolean> {
    if (!file.url) {
      return of(false);
    }
    console.log(file);
    const fileName = file.url.substring(file.url.lastIndexOf('/') + 1);

    return this.produtoService.removerArquivo(fileName).pipe(
      map(() => {
        this.message.success('Arquivo removido com sucesso');
        this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
        const arquivosAtuais = this.produtoForm.get('arquivosUrl')?.value ?? [];
        this.produtoForm.patchValue({
          arquivosUrl: arquivosAtuais.filter((url: string) => url !== file.url),
        });

        return true;
      }),
      catchError((err) => {
        this.message.error('Erro ao remover o arquivo');
        return of(false);
      })
    );
  }

  cancelar(): void {
    this.router.navigate(['/produtos/list']);
  }
}
