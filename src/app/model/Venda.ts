import { FormaDePagamento } from "./FormaDePagamento";
import { ItemVenda } from "./ItemVenda";

export interface Venda {
  id: number;
  criadoEm: string;
  formaPagamento: FormaDePagamento;
  valorTotal?: number;
  observacao?: string;
  itens: ItemVenda[];
}
