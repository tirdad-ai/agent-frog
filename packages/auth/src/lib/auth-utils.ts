import bcrypt from "bcryptjs";
import { db } from "@repo/database/client";
import { z } from "zod";

// Validation error messages type
export interface ValidationMessages {
  name_min?: string;
  email_invalid?: string;
  password_min_register?: string;
  password_required?: string;
}

// Validation schemas with customizable error messages
export const createRegisterSchema = (messages?: ValidationMessages) =>
  z.object({
    name: z
      .string()
      .min(2, messages?.name_min || "Name must be at least 2 characters"),
    email: z.string().email(messages?.email_invalid || "Invalid email address"),
    password: z
      .string()
      .min(
        8,
        messages?.password_min_register ||
          "Password must be at least 8 characters",
      ),
  });

export const createLoginSchema = (messages?: ValidationMessages) =>
  z.object({
    email: z.string().email(messages?.email_invalid || "Invalid email address"),
    password: z
      .string()
      .min(1, messages?.password_required || "Password is required"),
  });

// Default schemas for backward compatibility
export const registerSchema = createRegisterSchema();
export const loginSchema = createLoginSchema();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Register a new user with email and password
export async function registerUser(data: RegisterInput) {
  try {
    const { name, email, password } = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return { user, success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

// Verify user credentials
export async function verifyCredentials(email: string, password: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch {
    return null;
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  id: string,
  data: { name?: string; image?: string },
) {
  try {
    return await db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  } catch {
    return null;
  }
}
