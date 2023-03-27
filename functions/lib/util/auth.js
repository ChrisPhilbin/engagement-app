"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("./admin");
const auth = async (request, response, next) => {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
        idToken = request.headers.authorization.split("Bearer ")[1];
        admin_1.admin
            .auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
            request.user = decodedToken;
            return next();
        });
    }
    else {
        return response.status(403).json({ error: "Unauthorized" });
    }
};
exports.default = auth;
// const { admin, db } = require("./admin");
// const { defaultAppSettings } = require("./settingsHelper");
// module.exports = async (request, response, next) => {
//   let idToken;
//   if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
//     idToken = request.headers.authorization.split("Bearer ")[1];
//   } else {
//     console.error("No token found");
//     return response.status(403).json({ error: "Unauthorized" });
//   }
//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then((decodedToken) => {
//       request.user = decodedToken;
//       return next();
//     });
// };
//# sourceMappingURL=auth.js.map