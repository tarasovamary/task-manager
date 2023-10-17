import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError, tap, switchMap, empty, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class WebRequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

 refreshingAccessToken!: boolean;

 accessTokenRefreshed: Subject<any> = new Subject<any>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if(error.status === 401) {

         return this.refreshAccessToken()
          .pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }

        return throwError(() => new Error('error'));
      })
    )
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    } else {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log("Access Token Refreshed!");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next(true);
        })
      )
    }
  }

  addAuthHeader(request: HttpRequest<any>) {
    const token = this.authService.getAccessToken();

    if(token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
}
