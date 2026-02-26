// Firebase Admin SDK config

const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = {
  project_id: process.env.project_id,
  client_email: process.env.client_email,
  private_key: process.env.private_key?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
