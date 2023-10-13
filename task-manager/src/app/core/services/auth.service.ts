import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private router: Router,
               private webService: WebRequestService) { }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
      this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      console.log("LOGGED IN!");
      })
    )
  }

  logout() {
    this.removeSession();
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token-item');
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-token-item', accessToken);
  }

  private setSession(userId: string, accessToken: string | null, refreshToken: string | null) {
    localStorage.setItem('user-id', userId);
    if(accessToken !== null) {
      localStorage.setItem('access-token', accessToken);
    }
   if(refreshToken !== null) {
    localStorage.setItem('refresh-token', refreshToken);
   }
    
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}
