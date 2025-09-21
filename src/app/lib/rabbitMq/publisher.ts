/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import logger from "../../utils/serverTools/logger";
import { getChannel } from "./rabbit_mq";

export const publishJob = async (queue_name: string, payload: object) => {
  const channel = await getChannel();

  await channel.assertQueue(queue_name, { durable: true });

  channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  logger.info(`📤 Job published to ${queue_name}`);
};
