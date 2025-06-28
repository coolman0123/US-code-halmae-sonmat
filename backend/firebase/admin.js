require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔧 Firebase 환경 변수 확인:', {
  PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
  PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
  CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
  STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET
});

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin 초기화 성공');
  } catch (error) {
    console.error('❌ Firebase Admin 초기화 실패:', error.message);
  }
} else {
  console.log('✅ Firebase Admin 이미 초기화됨');
}

module.exports = admin;


