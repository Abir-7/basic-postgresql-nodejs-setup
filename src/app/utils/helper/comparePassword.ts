import bcrypt from "bcryptjs";

const comparePassword = async (
  plain_password: string,
  hashed_password: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plain_password, hashed_password);
  } catch (error: any) {
    return false;
  }
};

export default comparePassword;
