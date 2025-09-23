/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IAuthData {
  user_email: string;
  user_id: string;
  user_role: TUserRole;
}

export const user_roles = ["SUPERADMIN", "USER"] as const;

export type TUserRole = (typeof user_roles)[number];
