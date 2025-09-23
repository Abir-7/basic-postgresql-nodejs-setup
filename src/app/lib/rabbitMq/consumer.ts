/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import logger from "../../utils/serverTools/logger";
import { getChannel } from "./rabbitMq";

type job_handler = (data: any) => Promise<void>;

export const consumeQueue = async (
  queue_name: string,
  handler: job_handler
): Promise<void> => {
  const channel = await getChannel();
  await channel.assertQueue(queue_name, { durable: true });

  logger.info(` [*] Waiting for messages in queue: ${queue_name}`);

  channel.consume(
    queue_name,
    async (msg) => {
      if (!msg) return;

      logger.info(`📥 Message received in ${queue_name}`);

      const content = msg.content.toString();
      let data: any;

      // Safe JSON parse
      try {
        data = JSON.parse(content);
      } catch (err) {
        logger.error(`❌ Invalid JSON in ${queue_name}: ${content}`);
        channel.ack(msg); // discard bad messages
        return;
      }

      try {
        await handler(data);
        channel.ack(msg); // mark as processed
      } catch (error) {
        logger.error(`❌ Error processing ${queue_name}:`, error);

        // Option 1: requeue for retry
        // channel.nack(msg, false, true);

        // Option 2: discard (to avoid infinite loops if handler always fails)
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
};
