import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (req.url.includes('/auth/login')) {
    return next(req).pipe(
      tap({
        next: () => {
        },
        error: () => {
        }
      })
    );
  }

  const newReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  }) : req;

  return next(newReq).pipe(
    tap({
      next: () => {
      },
      error: () => {
      }
    })
  );
};
