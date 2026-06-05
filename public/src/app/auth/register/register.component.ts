import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [FormsModule, RouterLink]
})
export class RegisterComponent {
  username       = '';
  email          = '';
  password       = '';
  errorMessage   = '';
  successMessage = '';
  loading        = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage   = '';
    this.successMessage = '';
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Inscription réussie ! Vérifie ton email pour confirmer ton compte.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || "Erreur lors de l'inscription.";
      }
    });
  }
}
