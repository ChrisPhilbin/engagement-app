const { admin, db } = require("./admin");

module.exports = (request, response, next) => {
  console.log(request.body, "request body");
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
      console.log(decodedToken, "decoded token");
      request.user = decodedToken;
      // return db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
      return next();
    })
    // .then((data) => {
    //   if (!data) {
    //     //if user is not found we need to create one and then return next()
    //   } else {
    //     request.user.username = data.docs[0].data().username;
    //     return next();
    //   }
    // })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return response.status(403).json(err);
    });
};
