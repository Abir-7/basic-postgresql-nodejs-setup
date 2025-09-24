import { Router } from "express";
import { auth } from "../../../middlewares/auth/auth";
import { upload } from "../../../middlewares/fileUpload/fileUploadHandler";
import { UserProfileController } from "./userProfile.controller";
import { parseDataField } from "../../../middlewares/fileUpload/parseDataField";

const router = Router();

router.patch(
  "/update-profile",
  upload.single("image"),
  parseDataField("data"),
  auth("SUPERADMIN", "USER"),
  UserProfileController.updateProfile
);

export const UserProfileRoute = router;
