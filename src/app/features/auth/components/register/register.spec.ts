import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from './register';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['register']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should be invalid when empty', () => {
      component.registerForm.setValue({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      expect(component.registerForm.invalid).toBeTrue();
    });

    it('should require valid email format', () => {
      component.registerForm.setValue({
        name: 'John Doe',
        email: 'bad-email',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(component.registerForm.invalid).toBeTrue();
      expect(component.getFieldError('email')).toBe('Format d\'email invalide');
    });

    it('should require minimum password length', () => {
      component.registerForm.setValue({
        name: 'John Doe',
        email: 'test@example.com',
        password: '123',
        confirmPassword: '123',
      });
      expect(component.registerForm.invalid).toBeTrue();
      expect(component.getFieldError('password')).toContain('Minimum');
    });

    it('should require matching passwords', () => {
      component.registerForm.setValue({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      });
      expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
    });

    it('should be valid with proper values', () => {
      component.registerForm.setValue({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(component.registerForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    const formValues = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should not call AuthService if form is invalid', async () => {
      component.registerForm.setValue({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      await component.onSubmit();
      expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('should call AuthService and navigate on success', async () => {
      authServiceMock.register.and.returnValue(
        Promise.resolve({
          success: true,
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
            createdAt: new Date(),
            role: 'user',
          },
        })
      );

      component.registerForm.setValue(formValues);
      await component.onSubmit();

      expect(authServiceMock.register).toHaveBeenCalledWith(formValues);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/movies']);
      expect(component.error()).toBe('');
      expect(component.loading()).toBeFalse();
    });

    it('should set error message if registration fails', async () => {
      authServiceMock.register.and.returnValue(
        Promise.resolve({ success: false, error: 'Email already exists' })
      );

      component.registerForm.setValue(formValues);
      await component.onSubmit();

      expect(component.error()).toBe('Email already exists');
      expect(component.loading()).toBeFalse();
    });

    it('should handle unexpected errors', async () => {
      authServiceMock.register.and.throwError('Network error');

      component.registerForm.setValue(formValues);
      await component.onSubmit();

      expect(component.error()).toBe('Network error');
      expect(component.loading()).toBeFalse();
    });
  });

  describe('Utility methods', () => {
    it('isFieldInvalid should return true for touched invalid field', () => {
      const control = component.registerForm.get('name');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.isFieldInvalid('name')).toBeTrue();
    });

    it('getFieldError should return correct message for required field', () => {
      const control = component.registerForm.get('name');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('name')).toBe('Ce champ est requis');
    });
  });
});
