import { Router } from "express";
import { auth } from "../../../middlewares/auth/auth";
import { upload } from "../../../middlewares/fileUpload/fileUploadHandler";
import { UserProfileController } from "./userProfile.controller";

const router = Router();

router.patch(
  "/update-profile",
  auth("SUPERADMIN", "USER"),
  UserProfileController.updateProfile
);

export const UserProfileRoute = router;
