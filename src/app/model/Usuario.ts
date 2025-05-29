import { Perfil } from "./Perfil";
import { Pessoa } from "./Pessoa";
import { Unidade } from "./Unidade";

export interface Usuario {
  id: number;
  pessoa: Pessoa;
  email: string;
  senha: string;
  perfis: Perfil[];
  unidade: Unidade;
}
