const { db, admin } = require("../util/admin");
const { config } = require("../util/config");
const firebase = require("firebase");

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require("../util/validators");

exports.loginUser = async (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  try {
    const signedInUser = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    if (signedInUser) {
      const userInfoRef = await db.collection("users").where("userId", "==", signedInUser.user.uid).get();
      return response.status(200).json(userInfoRef.docs[0].data());
    } else {
      return response.status(200).json({ error: "Something went wrong trying to login." });
    }
  } catch (error) {
    console.log(error, "Something went wrong logging the user in.");
  }
};

exports.isUserSignedIn = (request, response) => {
  let idtoken;
  if (request.body.idtoken && request.body.idtoken.startsWith("Bearer ")) {
    idtoken = request.body.idtoken.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return response.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idtoken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      return response.status(200).json({ uid });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ general: "valid token not supplied" });
    });
};

exports.signUpUser = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({ username: "this username is already taken" });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already in use" });
      } else {
        return response.status(500).json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.getUserDetail = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        return response.json(userData);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.getUserAppSettings = (request, response) => {
  const defaultAppSettings = {
    birthdateThreshold: 7,
    lastInteractionThreshold: 7,
    workAnniversaryThreshold: 7,
    dailyDigest: false,
    weeklyDigest: false,
  };

  let userAppSettings = {};

  db.doc(`/users/${request.user.uid}`)
    .get()
    .then((settingsDoc) => {
      if (doc.exists) {
        userAppSettings = settingsDoc.data().appSettings ? settingsDoc.data().appSettings : defaultAppSettings;
        return response.status(200).json(userAppSettings);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error });
    });
};
