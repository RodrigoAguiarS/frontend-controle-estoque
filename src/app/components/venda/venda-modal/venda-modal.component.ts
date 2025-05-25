import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Venda } from '../../../model/Venda';

@Component({
  selector: 'app-venda-modal',
  imports: [CommonModule, NzDescriptionsModule, NzDividerModule, NzTagModule],
  templateUrl: './venda-modal.component.html',
  styleUrl: './venda-modal.component.css',
})
export class VendaModalComponent {
  @Input() venda: Venda | null = null;

  calcularSubtotal(): number {
    if (!this.venda?.itens?.length) {
      return 0;
    }

    return this.venda.itens.reduce(
      (total, item) => total + item.quantidade * item.produto.valorVenda,
      0
    );
  }
}
