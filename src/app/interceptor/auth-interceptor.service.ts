import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { CrudService } from '../service/crud.service';

// Interceptor HTTP que adiciona o token de acesso automaticamente
// Também renova tokens expirados e faz logout se necessário
export const AuthInterceptorService: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const service = inject(CrudService);

  // Recupera tokens do localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Ignora rotas de login e refresh-token
  if (req.url.includes('/login') || req.url.includes('/refresh-token')) {
    return next(req);
  }

  // Clona a requisição adicionando Authorization se houver accessToken
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // Encaminha a requisição e trata erros
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se não for 401 ou não houver refreshToken, retorna erro
      if (error.status !== 401 || !refreshToken) {
        return throwError(() => error);
      }

      // Se refreshToken expirou, faz logout
      if (isTokenExpired(refreshToken)) {
        logout(router);
        return throwError(() => error);
      }

      // Tenta atualizar os tokens
      return service.refreshTokens({
        accessToken: accessToken!,
        refreshToken: refreshToken
      }).pipe(
        switchMap(tokens => {
          // Salva os novos tokens no localStorage
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);

          // Clona a requisição original com novo token e envia
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          });

          return next(newReq);
        }),
        // Se o refresh falhar, faz logout
        catchError(refreshErr => {
          logout(router);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};

// Verifica se o token JWT expirou
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    // Considera expirado se não for possível decodificar
    return true;
  }
}

// Limpa tokens e redireciona para a página de login
function logout(router: Router) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  router.navigate(['my-bank.com.br/login']);
}
