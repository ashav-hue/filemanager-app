import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {

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
        if (response.role === 'ADMIN') {
          this.authService.saveSession(response);
          this.router.navigate(['/admin/users']);
        } else {
          this.errorMessage = 'Access denied. Admins only!';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password!';
        this.loading = false;
      }
    });
  }
}