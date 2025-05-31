import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-caixa-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NgxCurrencyDirective,
    NzButtonModule,
    NzAlertModule,
  ],
  template: `
    <form nz-form [formGroup]="form">
      <nz-alert
        *ngIf="operacaoTipo === 'retirada'"
        nzType="info"
        nzMessage="Retirada de Valor"
        [nzDescription]="
          valorMaximo
            ? 'O valor máximo disponível para retirada é ' +
              (valorMaximo | currency : 'BRL')
            : ''
        "
        nzShowIcon
        class="mb-3"
      >
      </nz-alert>

      <nz-alert
        *ngIf="operacaoTipo === 'abertura'"
        nzType="success"
        nzMessage="Abertura de Caixa"
        nzDescription="Informe o valor inicial para começar as operações do caixa."
        nzShowIcon
        class="mb-3"
      >
      </nz-alert>

      <nz-form-item>
        <nz-form-label [nzSpan]="7" nzRequired>{{ labelValor }}</nz-form-label>
        <nz-form-control [nzSpan]="17" [nzErrorTip]="errorTpl">
          <input
            nz-input
            currencyMask
            [options]="{
              prefix: 'R$ ',
              thousands: '.',
              decimal: ',',
              allowNegative: false,
              nullable: true,
              min: null,
              precision: 2
            }"
            placeholder="0,00"
            type="text"
            formControlName="valor"
            required
          />
          <ng-template #errorTpl let-control>
            <ng-container *ngIf="control.hasError('required')">
              Por favor informe um valor
            </ng-container>
            <ng-container *ngIf="control.hasError('min')">
              O valor deve ser maior que zero
            </ng-container>
            <ng-container *ngIf="control.hasError('max')">
              Valor excede o máximo disponível
            </ng-container>
          </ng-template>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="7">Observação</nz-form-label>
        <nz-form-control [nzSpan]="17">
          <textarea
            nz-input
            formControlName="observacao"
            rows="3"
            [placeholder]="observacaoPlaceholder"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <div class="footer">
        <button nz-button (click)="cancelar()">Cancelar</button>
        <button
          nz-button
          nzType="primary"
          [disabled]="form.invalid"
          (click)="confirmar()"
        >
          {{ botaoConfirmar }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }
      .mb-3 {
        margin-bottom: 16px;
      }
    `,
  ],
})
export class ModalAberturaCaixaComponent {
  form: FormGroup;
  titulo: string = 'Abertura de Caixa';
  labelValor: string = 'Valor Inicial';
  valorMaximo?: number;
  botaoConfirmar: string = 'Confirmar';
  observacaoPlaceholder: string = 'Observação (opcional)';
  operacaoTipo: 'abertura' | 'retirada' = 'abertura';

  constructor(
    private readonly fb: FormBuilder,
    private readonly modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    if (data) {
      this.titulo = data.titulo ?? this.titulo;
      this.labelValor = data.labelValor ?? this.labelValor;
      this.valorMaximo = data.valorMaximo;

      if (data.titulo?.toLowerCase().includes('retirada')) {
        this.operacaoTipo = 'retirada';
        this.botaoConfirmar = 'Retirar';
        this.observacaoPlaceholder = 'Motivo da retirada (opcional)';
      }
    }

    const valorInicial = this.operacaoTipo === 'retirada' ? null : 0;

    this.form = this.fb.group({
      valor: [
        valorInicial,
        [
          Validators.required,
          Validators.min(0.01),
          ...(this.valorMaximo ? [Validators.max(this.valorMaximo)] : []),
        ],
      ],
      observacao: [''],
    });
  }

  cancelar(): void {
    this.modalRef.close(null);
  }

  confirmar(): void {
    if (this.form.valid) {
      if (this.valorMaximo && this.form.value.valor > this.valorMaximo) {
        this.form.get('valor')?.setErrors({
          max: { required: this.valorMaximo, actual: this.form.value.valor },
        });
        return;
      }

      this.modalRef.close(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
    }
  }
}
