import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBLng1VL-Jwv989ScWFjfQMJtwSSB5ET2M',
  authDomain: 'ai-skindisease-classification.firebaseapp.com',
  projectId: 'ai-skindisease-classification',
  storageBucket: 'ai-skindisease-classification.firebasestorage.app',
  messagingSenderId: '695402546609',
  appId: '1:695402546609:web:8848ed26eb0e63f632a990',
};

// Initialize Firebase
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_AUTH = auth();
export const FIRESTORE_DB = firestore();
