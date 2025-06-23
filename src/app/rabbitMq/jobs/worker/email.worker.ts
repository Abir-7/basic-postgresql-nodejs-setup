import { sendEmail } from "../../../utils/sendEmail";
import { EmailJob } from "../types";

export const handleEmailJob = async (data: EmailJob) => {
  console.log("📧 Sending email to", data.to);
  await sendEmail(data.to, data.subject, data.text);
};
