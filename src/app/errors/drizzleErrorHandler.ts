interface IDbErrorResponse {
  status_code: number;
  message: string;
  errors: { path: string; message: string }[];
}

export const drizzleErrorHandler = (err: any): IDbErrorResponse => {
  // Duplicate key (unique constraint) violation
  if (err.code === "23505") {
    let message = "Duplicate key error.";
    if (err.constraint === "email_idx") {
      message =
        "This email is already registered. Please use a different email.";
    }
    return {
      status_code: 400,
      message,
      errors: [{ path: "", message }],
    };
  }

  // Foreign key violation
  if (err.code === "23503") {
    return {
      status_code: 400,
      message: "Invalid reference. Related record not found.",
      errors: [
        { path: "", message: "Invalid reference. Related record not found." },
      ],
    };
  }

  // Check constraint violation
  if (err.code === "23514") {
    return {
      status_code: 400,
      message: "Input does not satisfy database constraints.",
      errors: [
        { path: "", message: "Input does not satisfy database constraints." },
      ],
    };
  }

  // Fallback for other DB errors
  return {
    status_code: 500,
    message: "Database error occurred.",
    errors: [{ path: "", message: "Database error occurred." }],
  };
};
