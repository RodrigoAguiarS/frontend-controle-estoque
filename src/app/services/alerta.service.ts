import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private readonly tipoAlertaSubject = new BehaviorSubject<
    'success' | 'info' | 'warning' | 'error' | null
  >(null);
  private readonly mensagemAlertaSubject = new BehaviorSubject<string | null>(
    null
  );

  tipoAlerta$ = this.tipoAlertaSubject.asObservable();
  mensagemAlerta$ = this.mensagemAlertaSubject.asObservable();

  mostrarAlerta(
    tipo: 'success' | 'info' | 'warning' | 'error',
    mensagem: string
  ): void {
    this.tipoAlertaSubject.next(tipo);
    this.mensagemAlertaSubject.next(mensagem);
  }

  limparAlerta(): void {
    this.tipoAlertaSubject.next(null);
    this.mensagemAlertaSubject.next(null);
  }
}
