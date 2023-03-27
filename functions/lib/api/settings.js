"use strict";
const { db } = require("../util/admin");
const { defaultAppSettings } = require("../util/settingsHelper");
exports.saveSettings = (request, response) => {
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
exports.getSettings = async (request, response) => {
    try {
        const userFromDb = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
        if (userFromDb) {
            return response.status(200).json(userFromDb.docs[0].data().appSettings);
        }
        else {
            return response.status(404).json({ error: "User not found." });
            //user doc doesn't exist - create new user with default settings and return those setitngs
            //   const newUser = {
            //     userId: request.user.uid,
            //     email: request.user.email,
            //     createdAt: new Date(),
            //     appSettings: request.body.appSettings,
            //   };
            //   const newUserDoc = await db.collection("users").add(newUser);
            //   return response.status(200).json(newUserDoc);
        }
    }
    catch (error) {
        console.log(error, "Something went wrong.");
    }
};
exports.updateSettings = (request, response) => { };
//# sourceMappingURL=settings.js.map