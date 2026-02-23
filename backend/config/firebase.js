// Firebase Admin SDK config
const admin = require("firebase-admin");
const serviceAccount = require("../dailydose-b5bd3-firebase-adminsdk-fbsvc-7bf6947554.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
