import { Produto } from "./Produto";
import { Venda } from "./Venda";

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}
