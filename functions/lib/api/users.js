"use strict";
const { readFileSync } = require("node:fs");
const { db, admin } = require("../util/admin");
const { config } = require("../util/config");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { ref, uploadBytes, getDownloadURL, getStorage } = require("firebase/storage");
const formidable = require("formidable-serverless");
const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const { validateLoginData, validateSignUpData } = require("../util/validators");
const { defaultAppSettings } = require("../util/settingsHelper");
exports.loginUser = async (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password,
    };
    const { valid, errors } = validateLoginData(user);
    if (!valid)
        return response.status(400).json(errors);
    try {
        const signedInUser = await signInWithEmailAndPassword(auth, user.email, user.password);
        if (signedInUser) {
            const userInfoRef = await db.collection("users").where("userId", "==", signedInUser.user.uid).get();
            return response.status(200).json(userInfoRef.docs[0].data());
        }
        else {
            return response.status(400).json({ error: "Something went wrong trying to login." });
        }
    }
    catch (error) {
        console.log(error, "Something went wrong logging the user in.");
    }
};
exports.signUpUser = async (request, response) => {
    if (!request.body.email || !request.body.userId) {
        return response.status(400).json({ error: "Missing email or userId field. Cannot create user record!" });
    }
    const newUser = {
        email: request.body.email,
        userId: request.body.userId,
        createdAt: new Date(),
        appSettings: defaultAppSettings,
    };
    try {
        const doesUserExist = await db.collection("users").where("userId", "==", newUser.userId).limit(1).get();
        if (doesUserExist.docs.length === 0) {
            const newUserRecord = await db.collection("users").add(newUser);
            return response.status(200).json(newUser);
        }
        else {
            return response.status(400).json({ error: "Error creating new user record." });
        }
    }
    catch (error) {
        console.log(error, "Something went wrong setting up the new user record.");
        return response.status(500).json({ error: "Something went wrong setting up the new user record." });
    }
};
exports.isUserSignedIn = (request, response) => {
    let idtoken;
    if (request.body.idtoken && request.body.idtoken.startsWith("Bearer ")) {
        idtoken = request.body.idtoken.split("Bearer ")[1];
    }
    else {
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
exports.uploadFile = (request, response) => {
    const form = formidable({ multiples: true });
    form.parse(request, (error, fields, files) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ error: "Something went wrong. Please try again." });
        }
        if (!files.inboundProfilePicture) {
            return response.status(400).json({ error: "Photo cannot be blank." });
        }
        if (!files.inboundProfilePicture.type.includes("image")) {
            return response.status(400).json({ error: "File must be an image." });
        }
        const storageRef = ref(storage, `profile-pictures/${fields.uniqueId}`);
        uploadBytes(storageRef, readFileSync(files.inboundProfilePicture.path)).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                return response.status(200).json({ profilePictureUrl: url });
            });
        });
    });
};
//# sourceMappingURL=users.js.map