import { FormaDePagamento } from "./FormaDePagamento";
import { ItemVenda } from "./ItemVenda";

export interface Venda {
  id: number;
  criadoEm: string;
  formaDePagamento: FormaDePagamento;
  valorTotal?: number;
  observacao?: string;
  itens: ItemVenda[];
  ativo: boolean;
}
