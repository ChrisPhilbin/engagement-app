import firebaseAdmin from "firebase-admin";
import { config } from "./config";
import { getStorage } from "firebase-admin/storage";
import { Bucket } from "@google-cloud/storage";

export const admin: firebaseAdmin.app.App = firebaseAdmin.initializeApp(config);

export const db: firebaseAdmin.firestore.Firestore = admin.firestore();

export const bucket: Bucket = getStorage().bucket("profile-pictures");
