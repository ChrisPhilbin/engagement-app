import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request } from "express";
import { ISetting } from "./setting-model";

export interface IAppRequest extends Request, ISetting {
  headers: {
    authorization: string;
    lastinteractionthreshold: string;
    workanniversarythreshold: string;
    birthdatethreshold: string;
  };
  user: DecodedIdToken;
}
