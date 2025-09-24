const isExpired = (exp_date: Date | null): boolean => {
  if (!exp_date) return true; // Treat null as expired
  return new Date() > new Date(exp_date);
};

export default isExpired;
