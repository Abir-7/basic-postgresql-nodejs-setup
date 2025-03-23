const userLogin = async (loginData: { email: string; password: string }) => {};

const verifyUser = async (email: string, otp: number) => {};

const forgotPasswordRequest = async (email: string) => {};

const resetPassword = async (
  token: string,
  userData: {
    new_password: string;
    confirm_password: string;
  }
) => {};

const getNewAccessToken = async (refreshToken: string) => {};

const updatePassword = async (
  userId: string,
  passData: {
    new_password: string;
    confirm_password: string;
    old_password: string;
  }
) => {};

export const AuthService = {
  userLogin,
  verifyUser,
  forgotPasswordRequest,
  resetPassword,
  getNewAccessToken,
  updatePassword,
};
