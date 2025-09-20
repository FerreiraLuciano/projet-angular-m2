import { computed, Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = signal<User[]>([
    {
      id: 1,
      name: 'robert',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'patrick',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date('2024-01-02'),
    },
  ]);

  constructor() {
    this.loadCurrentUserFromLocalStorage();
    this.loadUsersFromLocalStorage();
  }

  public currentUser = signal<User | null>(null);

  // Signal avec validation
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // POST - Connexion
  async login(
    credentials: LoginRequest
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.delay(500);

    const user = this.users().find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      this.currentUser.set(user);
      this.saveUsersToLocalStorage();
      this.saveCurrentUserToLocalStorage();
      return { success: true, user };
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  }

  // POST - Inscription
  async register(
    userData: RegisterRequest
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.delay(600);

    // Vérifier si l'email existe déjà
    if (this.users().some((u) => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    // Vérifier que les mots de passe correspondent
    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: 'Les mots de passe ne correspondent pas' };
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.update((users) => [...users, newUser]);
    this.currentUser.set(newUser);

    this.saveCurrentUserToLocalStorage();
    this.saveUsersToLocalStorage();

    return { success: true, user: newUser };
  }

  // POST - Déconnexion
  async logout(): Promise<void> {
    await this.delay(200);
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  // GET - Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // GET - Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(): Promise<User[]> {
    await this.delay(400);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    return this.users().map((user) => ({
      ...user,
      password: '***', // Masquer les mots de passe
    }));
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.delay(400);

    this.users.update((users) => users.filter((user) => user.id !== id));

    this.saveUsersToLocalStorage();
    return true;
  }

  private saveCurrentUserToLocalStorage(): void {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
  }

  private loadCurrentUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users()));
  }

  private loadUsersFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
    }
  }
}
