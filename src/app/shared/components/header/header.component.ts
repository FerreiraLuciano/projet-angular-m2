import { AuthService } from '../../../features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Projet Angular M2</h1>
        <nav>
          <ul class="flex space-x-4">
            @if (authService.currentUser()) {
            <li><a routerLink="/home" class="hover:text-blue-200">Home</a></li>
            @if (authService.currentUser()?.role === 'admin') {
            <li><a routerLink="/admin" class="hover:text-blue-200">Admin</a></li>
            }
            <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
            } @else {
            <li><a routerLink="/auth/login" class="hover:text-blue-200">Login</a></li>
            <li><a routerLink="/auth/register" class="hover:text-blue-200">Register</a></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  // Injecter authService comme public pour l'utiliser dans le template
  protected authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
