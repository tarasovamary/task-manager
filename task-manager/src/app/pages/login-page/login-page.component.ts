import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(private authService: AuthService,
              private router: Router) {}

  onLoginButtonClicked(email: string, password: string) {
    console.log('EMAIL', email, 'PASSWORD', password);
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['/lists']);
      }
      console.log(res);
      
    });
  }
}
