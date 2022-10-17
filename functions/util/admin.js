const admin = require("firebase-admin");
const { config } = require("./config");
const { Storage } = require("@google-cloud/storage");

const app = admin.initializeApp({
  config,
});

const db = admin.firestore();

const storage = new Storage({
  projectId: config.projectId,
  keyFilename: "./fb_service_account.json",
});

const bucket = storage.bucket(config.storageBucket);

module.exports = { admin, db, bucket };
