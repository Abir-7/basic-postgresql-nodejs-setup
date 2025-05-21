/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IAuthData {
  userEmail: string;
  userId: string;
  userRole: TUserRole;
}

export const userRoles = {
  SUPERADMIN: "SUPERADMIN",
  USER: "USER",
} as const;

export type TUserRole = (typeof userRole)[keyof typeof userRole];

export const userRole = Object.values(userRoles);
