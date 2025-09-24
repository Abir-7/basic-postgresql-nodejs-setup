import status from "http-status";
import catchAsync from "../../../utils/serverTools/catchAsync";
import sendResponse from "../../../utils/serverTools/sendResponse";
import { UserProfileService } from "./userProfile.service";

const updateProfile = catchAsync(async (req, res) => {
  const userData = req.body;
  const filePath = req.file?.path;
  const result = await UserProfileService.updateProfileData(
    userData,
    req.user.user_id,
    filePath
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Profile info updated successfully.",
    data: result,
  });
});

export const UserProfileController = { updateProfile };
