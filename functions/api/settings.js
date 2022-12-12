const { db } = require("../util/admin");
const { defaultAppSettings } = require("../util/settingsHelper");

exports.saveSettings = async (request, response) => {
  try {
    const userFromDb = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
    if (userFromDb) {
      const user = userFromDb.docs[0].data();
      console.log(user, "User found! Current user w/ settings.");
      return response.status(200).json(user);
    } else {
      //user does not exist - let's create a new user along with their settings
      const newUser = {
        userId: request.user.uid,
        email: request.user.email,
        createdAt: new Date(),
        appSettings: request.body.appSettings,
      };
      const newUserDoc = await db.collection("users").add(newUser);
      return response.status(200).json(newUserDoc);
    }
  } catch (error) {
    console.log(error, "Something went wrong.");
  }
};

exports.getSettings = async (request, response) => {
  try {
    const userFromDb = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
    if (userFromDb) {
      //return entire user object which also includes their settings in the response
      return response.status(200).json(userFromDb.docs[0].data());
    } else {
      //user doc doesn't exist - create new user with default settings and return those setitngs
      const newUser = {
        userId: request.user.uid,
        email: request.user.email,
        createdAt: new Date(),
        appSettings: request.body.appSettings,
      };
      const newUserDoc = await db.collection("users").add(newUser);
      return response.status(200).json(newUserDoc);
    }
  } catch (error) {
    console.log(error, "Something went wrong.");
  }
};

exports.updateSettings = (request, response) => {};
