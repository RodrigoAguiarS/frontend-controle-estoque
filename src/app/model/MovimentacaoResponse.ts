import { Produto } from "./Produto";

export interface MovimentacaoResponse {
  id: number;
  criadoEm: string;
  tipo: string;
  quantidade: number;
  produto: Produto;
  valorMovimentacao: number;
}
