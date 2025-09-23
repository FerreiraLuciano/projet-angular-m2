import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { DisplayUser } from '../../auth/models/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    @if (user) {
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Édition d'utilisateur</h2>
          <button
            type="button"
            (click)="closed.emit()"
            class="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form [formGroup]="editUserForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
            <p
              *ngIf="editUserForm.get('name')?.invalid && editUserForm.get('name')?.touched"
              class="text-sm text-red-500 mt-1"
            >
              Le nom doit contenir au moins 2 caractères.
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
            <p
              *ngIf="editUserForm.get('email')?.invalid && editUserForm.get('email')?.touched"
              class="text-sm text-red-500 mt-1"
            >
              L'adresse email est invalide.
            </p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              id="role"
              formControlName="role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              (click)="closed.emit()"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="editUserForm.invalid"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
    }
  `,
})
export class EditUserModal implements OnChanges {
  @Input() user!: DisplayUser;
  @Input() users = signal<DisplayUser[]>([]);
  @Input() isDelete!: boolean;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  editUserForm: FormGroup;

  constructor() {
    this.editUserForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.editUserForm.patchValue(this.user);
    }
  }

  async onSubmit() {
    if (this.editUserForm.valid) {
      try {
        const updatedUser = {
          ...this.user,
          ...this.editUserForm.value,
        };
        await this.authService.updateUser(updatedUser);
        this.saved.emit();
        this.closed.emit();
      } catch (error) {
        throw new Error('An error occurred while updating the user ' + error);
      }
    }
  }
}
