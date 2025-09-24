import { ZodError } from "zod";

export const handleZodError = (
  err: ZodError
): {
  status_code: number;
  message: string;
  errors: { message: string; path: string }[];
} => {
  const status_code = 400;
  const message = "Validation failed!";

  // Map through Zod error issues and format them
  const errors = err.errors.map((e) => ({
    message: e.message,
    path: e.path.join("."),
  }));

  return { status_code, message, errors };
};
