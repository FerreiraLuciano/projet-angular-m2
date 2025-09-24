import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/env.dev';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  /**
   * API key (Bearer token) loaded from the environment configuration.
   */
  private readonly apiKey = environment.API_KEY;

  /**
   * Intercepts outgoing HTTP requests and appends the `Authorization` header
   * if the request is directed to `api.themoviedb.org`.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('api.themoviedb.org')) {
      const modifiedRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.apiKey),
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
