import { Router } from "express";
import { auth } from "../../../middlewares/auth/auth";
import { upload } from "../../../middlewares/fileUpload/fileUploadHandler";
import { UserProfileController } from "./userProfile.controller";

const router = Router();

router.patch(
  "/update-profile-image",
  auth("SUPERADMIN", "USER"),
  upload.single("image"),
  UserProfileController.updateProfileImage
);

router.patch(
  "/update-profile-data",
  auth("SUPERADMIN", "USER"),
  UserProfileController.updateProfileData
);

export const UserProfileRoute = router;
