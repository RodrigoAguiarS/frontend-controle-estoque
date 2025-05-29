import { Pipe, PipeTransform } from '@angular/core';
import { Produto } from './app/model/Produto';


@Pipe({
  name: 'CPF',
})
export class CPFPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    if (value && value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return 'error';
  }
}

@Pipe({
  name: 'formatarHorario',
})
export class FormatarHorarioPipe implements PipeTransform {
  transform(horario: any): string {
    const diasSemanaMap: { [key: string]: string } = {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };

    const diaSemana = diasSemanaMap[horario.diaSemana.toUpperCase()] || horario.diaSemana;
    const horaAbertura = horario.horaAbertura.slice(0, 5);
    const horaFechamento = horario.horaFechamento.slice(0, 5);

    if (horaAbertura === '00:00' && horaFechamento === '00:00') {
      return `${diaSemana}: Fechado`;
    }

    return `${diaSemana}: ${horaAbertura} às ${horaFechamento}`;
  }
}

@Pipe({
  name: 'cnpj',
})
export class CnpjPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    value = value.toString();
    if (value.length === 14) {
      return (
        value.substring(0, 2) +
        '.' +
        value.substring(2, 5) +
        '.' +
        value.substring(5, 8) +
        '/' +
        value.substring(8, 12) +
        '-' +
        value.substring(12, 14)
      );
    }
    return value;
  }
}

@Pipe({
  name: 'cep',
})
export class CEPPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace(/\D/g, '');
      if (value.length === 8) {
        return value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
      }
    }
    return value;
  }
}

@Pipe({
  name: 'categoriaFilter',
})
export class CategoriaFilterPipe implements PipeTransform {
  transform(produtos: Produto[], categoriaId: number): Produto[] {
    if (!produtos || !categoriaId) {
      return produtos;
    }
    return produtos.filter((produto) => produto.tipoProduto.id === categoriaId);
  }
}

@Pipe({
  name: 'telefone',
})
export class TelefonePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace(/\D/g, '');
      if (value.length === 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  }
}

@Pipe({
  name: 'localDateTimeFormat'
})
export class LocalDateTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const segundos = String(date.getSeconds()).padStart(2, '0');
    return `${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`;
  }
}
@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }
}
