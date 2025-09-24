import { computed, Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest, DisplayUser } from '../models/user.model';

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

  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Authenticates a user with the provided credentials.
   */
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

  /**
   * Registers a new user based on the provided registration data.
   * Validates the user's email for uniqueness and ensures the password and confirmation password match.
   * If validation passes, the new user is added to the user list and saved to local storage.
   */
  async register(
    userData: RegisterRequest
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.delay(600);

    if (this.users().some((u) => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

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

  /**
   * Logs out the current user by resetting the user state and removing
   * user-related data from local storage.
   */
  async logout(): Promise<void> {
    await this.delay(200);
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  /**
   * Retrieves a list of all users with their passwords masked.
   */
  async getAllUsers(): Promise<User[]> {
    await this.delay(400);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    return this.users().map((user) => ({
      ...user,
      password: '***',
    }));
  }

  /**
   * Deletes a user from the list of users.
   */
  async deleteUser(id: number): Promise<boolean> {
    await this.delay(400);

    this.users.update((users) => users.filter((user) => user.id !== id));

    this.saveUsersToLocalStorage();
    return true;
  }

  /**
   * Saves the current user's information to the browser's local storage.
   * The user's data is serialized into a JSON string and stored under the key 'currentUser'.
   */
  private saveCurrentUserToLocalStorage(): void {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
  }

  /**
   * Loads the current user's data from the local storage and updates the currentUser observable if data is found.
   * The data is retrieved using the 'currentUser' key and parsed from JSON format.
   * If no data is found in the local storage, no changes are made.
   */
  private loadCurrentUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  /**
   * Saves the current list of users to the local storage.
   * The users are stringified and stored under the key 'users'.
   */
  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users()));
  }

  /**
   * Loads the user data stored in the browser's local storage and parses it into the application.
   * If user data exists in local storage, it sets the parsed data to the `users` property.
   */
  private loadUsersFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
    }
  }

  /**
   * Updates an existing user's information based on teh provided data.
   */
  async updateUser(userData: DisplayUser): Promise<User> {
    let updatedUser: User | null = null;
    this.users.update((users) => {
      return users.map((user) => {
        if (user.id === userData.id) {
          updatedUser = {
            ...user,
            ...userData,
          };
          return updatedUser;
        }
        return user;
      });
    });

    this.saveUsersToLocalStorage();

    if (!updatedUser) throw new Error('User not found');

    return updatedUser;
  }
}
