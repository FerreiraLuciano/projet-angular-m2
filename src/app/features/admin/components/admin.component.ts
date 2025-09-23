import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { DisplayUser } from '../../auth/models/user.model';
import { ReviewService } from '../../reviews/services/review.service';
import { Review } from '../../reviews/models/review.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserModal } from './edit-user-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditUserModal],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
        <p class="text-gray-600 mt-2">Gérez les utilisateurs et les avis</p>
      </div>

      <!-- Navigation Admin -->
      <div class="mb-8">
        <nav class="flex space-x-4">
          <button
            (click)="activeTab.set('users')"
            [class.bg-blue-600]="activeTab() === 'users'"
            [class.text-white]="activeTab() === 'users'"
            [class.text-gray-700]="activeTab() !== 'users'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Utilisateurs
          </button>
          <button
            (click)="activeTab.set('reviews')"
            [class.bg-blue-600]="activeTab() === 'reviews'"
            [class.text-white]="activeTab() === 'reviews'"
            [class.text-gray-700]="activeTab() !== 'reviews'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Reviews
          </button>
        </nav>
      </div>

      <!-- Onglet Utilisateurs -->
      @if (activeTab() === 'users') {
      <app-edit-user-modal
        [user]="editingUser()!"
        [users]="users"
        (saved)="loadUsers()"
        (closed)="closeEditForm()"
      />

      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
        </div>
        <div class="p-6">
          @if (users().length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utilisateur
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rôle
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of users(); track user.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div
                          class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                        >
                          <span class="text-sm font-medium text-gray-700">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ user.role }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button (click)="openEditForm(user)" class="text-blue-600 hover:text-blue-900">
                      Éditer
                    </button>
                    @if (user.role !== 'admin') {
                    <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                    } @else {
                    <span class="text-gray-400">Admin protégé</span>
                    }
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          } @else {
          <p class="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
          }
        </div>
      </div>
      }

      <!-- Onglet Reviews -->
      @if (activeTab() === 'reviews') {
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Gestion des Reviews</h2>
        </div>
        <div class="p-6">
          @if (reviews().length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Film
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utilisateur
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Commentaire
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (review of reviews(); track review.id) {
                <tr>
                  <td class="px-6 py-4">{{ review.movieId }}</td>
                  <td class="px-6 py-4">{{ review.author }}</td>
                  <td class="px-6 py-4">{{ review.content }}</td>
                  <td class="px-6 py-4">
                    <button
                      (click)="deleteReview(review.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          } @else {
          <p class="text-gray-500 text-center py-8">Aucune review trouvée</p>
          }
        </div>
      </div>
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);

  activeTab = signal<'users' | 'reviews'>('users');
  users = signal<DisplayUser[]>([]);
  reviews = signal<Review[]>([]);
  editingUser = signal<DisplayUser | null>(null);

  async ngOnInit() {
    await this.loadUsers();
    await this.loadReviews();
  }

  async loadUsers() {
    const users = await this.authService.getAllUsers();
    this.users.set(users);
  }

  async loadReviews() {
    this.reviews.set(this.reviewService.getAllReviews());
  }

  async deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await this.authService.deleteUser(userId);
      await this.loadUsers();
    }
  }

  openEditForm(user: DisplayUser) {
    this.editingUser.set({ ...user });
  }

  closeEditForm() {
    this.editingUser.set(null);
  }

  async deleteReview(reviewId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette review ?')) {
      this.reviewService.deleteReview(reviewId);
      await this.loadReviews();
    }
  }
}
