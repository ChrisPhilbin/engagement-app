import { Response } from "express";
import { db } from "../util/admin";
import { IAppRequest } from "./models/app-request-model";

export const saveSettings = (request: IAppRequest, response: Response) => {
  db.collection("users")
    .where("userId", "==", request.user.uid)
    .limit(1)
    .get()
    .then((query) => {
      const userRef = query.docs[0];
      let tempUser = userRef.data();
      tempUser.appSettings = request.body;
      userRef.ref.update(tempUser);
      return response.status(200).json(tempUser.appSettings);
    });
};

export const getSettings = async (request: IAppRequest, response: Response) => {
  try {
    const userFromDb = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
    if (userFromDb) {
      return response.status(200).json(userFromDb.docs[0].data().appSettings);
    } else {
      return response.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.log(error, "Something went wrong.");
  }
};

// exports.updateSettings = (request, response) => {};
