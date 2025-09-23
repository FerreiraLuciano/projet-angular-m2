import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should be invalid when empty', () => {
      component.loginForm.setValue({ email: '', password: '' });
      expect(component.loginForm.invalid).toBeTrue();
    });

    it('should require a valid email', () => {
      component.loginForm.setValue({ email: 'invalid', password: 'password123' });
      expect(component.loginForm.invalid).toBeTrue();
      expect(component.getFieldError('email')).toBe('Format d\'email invalide');
    });

    it('should require a minimum password length', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: '123' });
      expect(component.loginForm.invalid).toBeTrue();
      expect(component.getFieldError('password')).toContain('Minimum');
    });

    it('should be valid with proper values', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    const credentials: LoginRequest = { email: 'test@example.com', password: 'password123' };

    it('should not call AuthService if form is invalid', async () => {
      component.loginForm.setValue({ email: '', password: '' });
      await component.onSubmit();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should login successfully and navigate', async () => {
      authServiceMock.login.and.returnValue(
        Promise.resolve({
          success: true,
          user: {
            id: 1,
            email: credentials.email,
            name: 'Test User',
            password: credentials.password,
            createdAt: new Date(),
            role: 'user',
          },
        })
      );

      component.loginForm.setValue(credentials);
      await component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalledWith(credentials);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/movies']);
      expect(component.loading()).toBeFalse();
      expect(component.error()).toBe('');
    });

    it('should set error when login fails with error message', async () => {
      authServiceMock.login.and.returnValue(
        Promise.resolve({
          success: false,
          error: 'Invalid credentials',
        })
      );

      component.loginForm.setValue(credentials);
      await component.onSubmit();

      expect(component.error()).toBe('Invalid credentials');
      expect(component.loading()).toBeFalse();
    });

    it('should handle unexpected errors', async () => {
      authServiceMock.login.and.throwError('Network error');

      component.loginForm.setValue(credentials);
      await component.onSubmit();

      expect(component.error()).toBe('Network error');
      expect(component.loading()).toBeFalse();
    });
  });

  describe('Utility methods', () => {
    it('isFieldInvalid should return true if field is touched and invalid', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      expect(component.isFieldInvalid('email')).toBeTrue();
    });

    it('getFieldError should return correct message for required field', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      expect(component.getFieldError('password')).toBe('Ce champ est requis');
    });
  });
});
