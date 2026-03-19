import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent {

  fullName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.fullName = this.authService.getFullName();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}