import { TipoProduto } from "./TipoProduto";

export interface Produto {
  id: number;
  descricao: string;
  tipoProduto: TipoProduto;
  valorFornecedor: number;
  valorVenda: number;
  quantidadeEstoque: number;
  dataCriacao: string;
  arquivosUrl: string[];
  ativo: boolean;
}
