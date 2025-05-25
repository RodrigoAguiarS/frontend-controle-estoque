import { Produto } from "./Produto";

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}
