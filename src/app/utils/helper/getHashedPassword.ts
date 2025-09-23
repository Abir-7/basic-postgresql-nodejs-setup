/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { app_config } from "../../config";
import bcrypt from "bcryptjs";

const getHashedPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, Number(app_config.bcrypt.salt_round));
  } catch (error: any) {
    throw new Error("Error hashing password");
  }
};
export default getHashedPassword;
