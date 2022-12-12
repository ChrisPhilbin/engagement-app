const { admin, db } = require("./admin");
const { defaultAppSettings } = require("../util/settingsHelper");

module.exports = async (request, response, next) => {
  let idToken;
  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return response.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      return next();
    });
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(idToken);
  //   request.user = decodedToken;
  //   const userFromDb = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
  //   if (userFromDb.exists) {
  //     console.log("User found!");
  //   } else {
  //     const newUser = {
  //       userId: decodedToken.user_id,
  //       email: decodedToken.email,
  //       createdAt: new Date(),
  //       appSettings: defaultAppSettings,
  //     };
  //     request.user.appSettings = newUser.appSettings;
  //     const userRef = await db.collection("users").add(newUser);
  //   }
  //   return next();
  // } catch (error) {
  //   console.error("Something went wrong when setting up a new user.", error);
  //   return response.status(403).json(error);
  // }

  // admin
  //   .auth()
  //   .verifyIdToken(idToken)
  //   .then((decodedToken) => {
  //     console.log(decodedToken, "decoded token");
  //     request.user = decodedToken;
  //     return  db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
  //     // return next();
  //   })
  //   .then((data) => {
  //     if (!data) {
  //       //if user is not found we need to create one and then return next()
  //     } else {
  //       request.user.username = data.docs[0].data().username;
  //       return next();
  //     }
  //   })
  //   .catch((err) => {
  //     console.error("Error while verifying token", err);
  //     return response.status(403).json(err);
  //   });
};
