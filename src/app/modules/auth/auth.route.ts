import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth/auth";
import zodValidator from "../../middlewares/zodValidator";
import { zodCreateUserSchema } from "../users/user/user.validation";

const router = Router();

router.post(
  "/create-user",
  zodValidator(zodCreateUserSchema),
  AuthController.createUser
);
router.post("/login", AuthController.userLogin);

router.get("/get-access-token", AuthController.getNewAccessToken);

router.patch("/verify-user", AuthController.verifyUser);
router.patch("/resend-code", AuthController.resendCode);
router.patch("/forgot-password-request", AuthController.forgotPasswordRequest);
router.patch("/reset-password", AuthController.resetPassword);
router.patch("/update-password", auth("USER"), AuthController.updatePassword);
export const AuthRoute = router;
