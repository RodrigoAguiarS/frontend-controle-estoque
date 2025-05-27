import { Empresa } from "./Empresa";

export interface Unidade {
  id: number;
  nome: string;
  telefone: string;
  empresa: Empresa;
}
