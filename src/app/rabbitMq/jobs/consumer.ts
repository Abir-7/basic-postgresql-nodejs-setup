import { getRabbitConnection } from "../rabbitMq";
import { JobPayload } from "./types";
import { handleEmailJob } from "./worker/email.worker";

const QUEUE = "job_queue";

export const startJobConsumer = async () => {
  const conn = await getRabbitConnection();
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log("🔁 Waiting for jobs...");

  channel.consume(
    QUEUE,
    async (msg: { content: { toString: () => string } }) => {
      if (!msg) return;
      const payload: JobPayload = JSON.parse(msg.content.toString());

      try {
        switch (payload.type) {
          case "email":
            await handleEmailJob(payload.data);
            break;
          // Add more job types here
          default:
            console.warn("Unknown job type:", payload.type);
        }

        channel.ack(msg);
      } catch (err) {
        console.error("Job failed:", err);
        // channel.nack(msg, false, true); // optional retry
      }
    },
    { noAck: false }
  );
};
