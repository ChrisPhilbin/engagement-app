import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request } from "express";

export interface IAppRequest extends Request {
  headers: {
    authorization: string;
  };
  user: DecodedIdToken;
}
