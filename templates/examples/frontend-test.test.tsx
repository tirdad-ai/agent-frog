/**
 * Example Frontend Component Test
 * 
 * Framework: Vitest + React Testing Library
 * Pattern: User-centric testing
 * Purpose: Test component behavior from user perspective
 * 
 * This example shows:
 * - Component rendering with React Testing Library
 * - User interaction testing with @testing-library/user-event
 * - Form validation testing
 * - API mocking with MSW (Mock Service Worker)
 * - TanStack Query integration testing
 * - All 4 states (loading, error, empty, success)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserForm } from '@/components/users/user-form';

// Helper to create test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Disable retry for tests
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      // Arrange & Act
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render with initial values when provided', () => {
      // Arrange
      const initialData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act
      render(<UserForm initialData={initialData} onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByLabelText(/email/i)).toHaveValue(initialData.email);
      expect(screen.getByLabelText(/name/i)).toHaveValue(initialData.name);
    });
  });

  describe('Validation', () => {
    it('should show error for invalid email', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Act
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Blur to trigger validation

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for short name', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Act
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'A'); // Too short
      await user.tab();

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should show error for weak password', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Act
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, '123'); // Too short
      await user.tab();

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should disable submit button when form is invalid', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'invalid');

      // Assert
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data on valid submit', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      const formData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123!',
      };

      // Act
      await user.type(screen.getByLabelText(/email/i), formData.email);
      await user.type(screen.getByLabelText(/name/i), formData.name);
      await user.type(screen.getByLabelText(/password/i), formData.password);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledOnce();
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining(formData)
        );
      });
    });

    it('should not call onSubmit when form is invalid', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
      });
    });

    it('should disable form fields during submission', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeDisabled();
        expect(screen.getByLabelText(/name/i)).toBeDisabled();
        expect(screen.getByLabelText(/password/i)).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on API error', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => Promise.reject(new Error('API Error')));
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/api error/i)).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => Promise.reject(new Error('API Error')));
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Success State', () => {
    it('should show success message on successful submission', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => Promise.resolve());
      
      render(<UserForm onSubmit={mockOnSubmit} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });
    });

    it('should reset form after successful submission', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn(() => Promise.resolve());
      
      render(<UserForm onSubmit={mockOnSubmit} resetOnSuccess />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/password/i)).toHaveValue('');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      // Arrange & Act
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-required', 'true');
    });

    it('should announce errors to screen readers', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<UserForm onSubmit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      // Act
      await user.type(screen.getByLabelText(/email/i), 'invalid');
      await user.tab();

      // Assert
      await waitFor(() => {
        const errorMessage = screen.getByText(/valid email/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });
});
