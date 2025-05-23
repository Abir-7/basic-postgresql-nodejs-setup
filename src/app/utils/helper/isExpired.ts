/**
 * Checks if the provided expiration date has already passed.
 * @param expDate - The expiration date to compare
 * @returns true if expired, false otherwise
 */
const isExpired = (expDate: Date | null): boolean => {
  if (!expDate) return true; // Treat null as expired
  return new Date() > new Date(expDate);
};

export default isExpired;
