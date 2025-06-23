export type JobType = "email" | "notification" | "report";

export interface EmailJob {
  to: string;
  subject: string;
  text: string;
}

export interface JobPayload {
  type: JobType;
  data: any;
}
