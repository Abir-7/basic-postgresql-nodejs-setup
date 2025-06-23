import { getRabbitConnection } from "../rabbitMq";
import { JobPayload } from "./types";

const QUEUE = "job_queue";

export const dispatchJob = async (job: JobPayload) => {
  const conn = await getRabbitConnection();
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });

  await channel.close();
};
