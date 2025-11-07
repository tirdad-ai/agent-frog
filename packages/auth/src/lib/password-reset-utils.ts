import { db } from "@repo/database/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Generate a password reset token for a user
 * @param email User's email address
 * @returns Token string or null if user not found
 */
export async function generatePasswordResetToken(
  email: string,
): Promise<string | null> {
  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("[Password Reset] User not found:", email);
      return null;
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    console.log(
      "[Password Reset] Generating token for:",
      email,
      "Expires:",
      expires,
    );

    // Delete any existing tokens for this user
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    const created = await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    console.log(
      "[Password Reset] Token created:",
      token.substring(0, 10) + "...",
    );
    return token;
  } catch (error) {
    console.error("Error generating password reset token:", error);
    return null;
  }
}

/**
 * Verify a password reset token
 * @param token Reset token
 * @returns User email if valid, null otherwise
 */
export async function verifyPasswordResetToken(
  token: string,
): Promise<string | null> {
  try {
    console.log("\n========================================");
    console.log("[Password Reset] Verifying token");
    console.log("Token received:", token);
    console.log("Token length:", token?.length, "characters");
    console.log("Expected: 64 characters");
    console.log("========================================\n");

    const resetToken = await db.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!resetToken) {
      console.log("[Password Reset] Token not found or expired");
      // Check if token exists without expiry filter
      const anyToken = await db.verificationToken.findFirst({
        where: { token },
      });
      if (anyToken) {
        console.log(
          "[Password Reset] Token exists but is expired. Expiry:",
          anyToken.expires,
        );
        console.log("[Password Reset] Expected token:", anyToken.token);
        console.log(
          "[Password Reset] Expected length:",
          anyToken.token?.length,
        );
      } else {
        console.log("[Password Reset] Token does not exist in database");
        // Show all tokens for debugging
        const allTokens = await db.verificationToken.findMany();
        console.log("[Password Reset] Total tokens in DB:", allTokens.length);
        if (allTokens.length > 0) {
          console.log(
            "[Password Reset] Sample token from DB:",
            allTokens[0]?.token.substring(0, 20) + "...",
          );
          console.log(
            "[Password Reset] Sample token length:",
            allTokens[0]?.token.length,
          );
        }
      }
      return null;
    }

    console.log("[Password Reset] Token verified for:", resetToken.identifier);
    return resetToken.identifier;
  } catch (error) {
    console.error("Error verifying password reset token:", error);
    return null;
  }
}

/**
 * Reset user password with token
 * @param token Reset token
 * @param newPassword New password
 * @returns Success boolean
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<boolean> {
  try {
    // Verify token
    const email = await verifyPasswordResetToken(token);

    if (!email) {
      return false;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete used token
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    return false;
  }
}
