import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User = {
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
    active: true
  };

  isEditMode: boolean = false;
  userId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditMode = true;
      this.loadUser();
    }
  }

  loadUser(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (data) => {
        this.user = data;
        this.user.password = '';
      },
      error: () => {
        this.errorMessage = 'Failed to load user!';
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.userService.updateUser(this.userId!, this.user).subscribe({
        next: () => {
          this.successMessage = 'User updated successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 1500);
        },
        error: () => {
          this.errorMessage = 'Failed to update user!';
          this.loading = false;
        }
      });
    } else {
      this.userService.createUser(this.user).subscribe({
        next: () => {
          this.successMessage = 'User created successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 1500);
        },
        error: () => {
          this.errorMessage = 'Failed to create user!';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}