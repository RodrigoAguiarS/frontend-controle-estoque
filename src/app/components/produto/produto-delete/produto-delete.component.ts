import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoProduto } from '../../model/TipoProduto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoProdutoService } from '../../../services/tipo-produto.service';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
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
  selector: 'app-produto-delete',
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
  templateUrl: './produto-delete.component.html',
  styleUrl: './produto-delete.component.css'
})
export class ProdutoDeleteComponent {

  produtoForm!: FormGroup;
  tiposProduto: TipoProduto[] = [];
  fileList: NzUploadFile[] = [];

  id!: number;
  carregando = false;

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
    this.carregarProdutos();
    this.carregarCategorias();
  }

  delete(): void {
    this.carregando = true;
    this.produtoService.delete(this.id).subscribe({
      next: () => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Produto deletado com sucesso!',
            message: 'O Produto foi deletado com sucesso!',
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

  private carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.findById(this.id).subscribe({
      next: (tarefa) => {
        this.produtoForm.patchValue(tarefa);
        this.produtoForm.get('tipoProdutoId')?.setValue(tarefa.tipoProduto.id);
        this.produtoForm.disable();
        this.fileList = tarefa.arquivosUrl.map((url, index) => ({
          uid: `${index}`,
          name: `${url.substring(url.lastIndexOf('/')) + 1}`,
          status: 'done',
          url: url,
        }));
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

  private carregarCategorias(): void {
    this.carregando = true;
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.tiposProduto = response;
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

  cancelar(): void {
    this.router.navigate(['/produtos/list']);
  }
}
