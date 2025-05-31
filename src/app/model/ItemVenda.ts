import { Produto } from "./Produto";

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  observacao: string;
  valorUnitario: number;
  valorTotal: number;
}
