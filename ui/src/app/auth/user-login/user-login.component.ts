import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.role === 'USER') {
          this.authService.saveSession(response);
          this.router.navigate(['/user/files']);
        } else {
          this.errorMessage = 'Access denied. Users only!';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Invalid email or password!';
        this.loading = false;
      }
    });
  }
}