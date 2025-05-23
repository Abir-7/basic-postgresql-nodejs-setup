import bcrypt from "bcryptjs";

/**
 * Compares a plain password with a hashed password.
 * @param plainPassword - The plain text password from user input
 * @param hashedPassword - The hashed password stored in the database
 * @returns A boolean indicating whether the passwords match
 */
const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error: any) {
    // Optional: Log error or handle differently
    return false;
  }
};

export default comparePassword;
