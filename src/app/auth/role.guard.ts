import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('RoleGuard: Verificando acesso para a rota:', state.url);

    return this.authService.getUserRoles().pipe(
      switchMap((userRoles: string[]) => {
        console.log('RoleGuard: Roles do usuário:', userRoles);

        const requiredRoles = route.data['roles'] as string[];
        console.log('RoleGuard: Roles necessárias para a rota:', requiredRoles);

        if (!requiredRoles) {
          console.warn('RoleGuard: Nenhuma role necessária definida na rota.');
          this.router.navigate(['/acesso-negado']);
          return of(false);
        }

        if (requiredRoles.some((role) => userRoles.includes(role))) {
          console.log('RoleGuard: Acesso permitido.');
          return of(true);
        } else {
          console.warn(
            'RoleGuard: Acesso negado. Redirecionando para /acesso-negado.'
          );
          this.router.navigate(['/acesso-negado']);
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('RoleGuard: Erro ao verificar roles do usuário:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
