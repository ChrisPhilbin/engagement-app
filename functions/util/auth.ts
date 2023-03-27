import { IAppRequest } from "../api/models/app-request-model";
import { admin } from "./admin";
import { Response } from "express";

const auth = async (request: IAppRequest, response: Response, next: Function): Promise<Response<any> | undefined> => {
  let idToken: string;
  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    idToken = request.headers.authorization.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        request.user = decodedToken;
        return next();
      });
  } else {
    return response.status(403).json({ error: "Unauthorized" });
  }
};

export default auth;

// const { admin, db } = require("./admin");
// const { defaultAppSettings } = require("./settingsHelper");

// module.exports = async (request, response, next) => {
//   let idToken;
//   if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
//     idToken = request.headers.authorization.split("Bearer ")[1];
//   } else {
//     console.error("No token found");
//     return response.status(403).json({ error: "Unauthorized" });
//   }
//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then((decodedToken) => {
//       request.user = decodedToken;
//       return next();
//     });
// };
