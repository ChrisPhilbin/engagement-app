const admin = require("firebase-admin");
const config = require("./config");
const { getStorage } = require("firebase-admin/storage");

admin.initializeApp(config);

const db = admin.firestore();

const bucket = getStorage().bucket("profile-pictures");

module.exports = { admin, db, bucket };
