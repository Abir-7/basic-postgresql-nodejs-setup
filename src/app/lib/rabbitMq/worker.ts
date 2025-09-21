/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import logger from "../../utils/serverTools/logger";
import { send_email } from "../../utils/serverTools/sendEmail";
import { consumeQueue } from "./consumer";

export const startConsumers = () => {
  consumeQueue("email_queue", async (job) => {
    const { to, subject, body } = job;

    try {
      logger.info(`Processing email job: ${to}, ${subject}`);
      await send_email(to, subject, body); // Call your email function
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error("Error processing email job:", error);
      throw error; // let nack handle retry/discard
    }
  });
};

// Initialize consumers when the app starts
