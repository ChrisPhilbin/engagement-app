"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.saveSettings = void 0;
const admin_1 = require("../util/admin");
const saveSettings = (request, response) => {
    admin_1.db.collection("users")
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
exports.saveSettings = saveSettings;
const getSettings = async (request, response) => {
    try {
        const userFromDb = await admin_1.db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
        if (userFromDb) {
            return response.status(200).json(userFromDb.docs[0].data().appSettings);
        }
        else {
            return response.status(404).json({ error: "User not found." });
        }
    }
    catch (error) {
        console.log(error, "Something went wrong.");
    }
};
exports.getSettings = getSettings;
// exports.updateSettings = (request, response) => {};
//# sourceMappingURL=settings.js.map