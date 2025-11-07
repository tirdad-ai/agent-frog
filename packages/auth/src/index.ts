// Auth configuration
export { auth, handlers, signIn, signOut } from "./lib/auth";
export {
  registerUser,
  verifyCredentials,
  getUserById,
  updateUserProfile,
} from "./lib/auth-utils";
export {
  generatePasswordResetToken,
  verifyPasswordResetToken,
  resetPassword,
} from "./lib/password-reset-utils";

// React components
export { AuthProvider } from "./components/AuthProvider";
export { LoginForm } from "./components/LoginForm";
export { SignupForm } from "./components/SignupForm";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ResetPasswordForm } from "./components/ResetPasswordForm";
export { UserButton } from "./components/UserButton";
export { TenantSelector } from "./components/TenantSelector";
export { AuthError } from "./components/AuthError";

// Hooks
export { useAuth } from "./hooks/useAuth";
export { useRequireAuth } from "./hooks/useRequireAuth";

// Types
export type { AuthUser, AuthSession } from "./types";
export type { RegisterInput, LoginInput } from "./lib/auth-utils";
