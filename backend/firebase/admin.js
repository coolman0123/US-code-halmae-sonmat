const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require(path.join(
  __dirname,
  '../env/gm-hand-firebase-adminsdk-fbsvc-28b711dc63.json'
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}


module.exports = admin;
