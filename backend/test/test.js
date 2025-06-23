// test-require.js
try {
  const repo = require('./backend/firebase/FirebaseRepository.js');
  console.log('✅ FirebaseRepository loaded');
  
  const admin = require('./backend/firebase/admin.js');
  console.log('✅ admin.js loaded');
  
  console.log('Firestore instance:', admin.firestore());
} catch (e) {
  console.error('❌ Error:', e.message);
}
