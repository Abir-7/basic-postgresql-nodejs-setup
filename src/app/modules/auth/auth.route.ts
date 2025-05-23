import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth/auth";

const router = Router();

router.get("/get-access-token", AuthController.getNewAccessToken);

router.post("/login", AuthController.userLogin);

router.patch("/verify-user", AuthController.verifyUser);
router.patch("/resend-code", AuthController.resendCode);
router.patch("/forgot-password-request", AuthController.forgotPasswordRequest);
router.patch("/reset-password", AuthController.resetPassword);
router.patch("/update-password", auth("USER"), AuthController.updatePassword);
export const AuthRoute = router;
