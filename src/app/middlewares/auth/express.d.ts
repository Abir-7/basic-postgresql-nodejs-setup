import { IAuthData } from "./auth.interface";

declare global {
  namespace Express {
    interface Request {
      user: IAuthData;
    }
  }
}
