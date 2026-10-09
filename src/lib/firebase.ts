import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Same Firebase project as the web app (these web config values are not secrets;
// access is controlled by your Firestore security rules).
const firebaseConfig = {
  apiKey: 'AIzaSyDwaYBCfJvnT9srbNwYRTTj8aSxdsl9Y68',
  authDomain: 'isebe-e2a38.firebaseapp.com',
  projectId: 'isebe-e2a38',
  storageBucket: 'isebe-e2a38.firebasestorage.app',
  messagingSenderId: '1028278452111',
  appId: '1:1028278452111:web:a0b85033f6b715c36195fa',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function makeAuth(): Auth {
  if (Platform.OS === 'web') return getAuth(app);
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Already initialised (fast refresh)
    return getAuth(app);
  }
}

export const auth = makeAuth();
export const db = getFirestore(app);

// Cloudinary (unsigned uploads) – same account as the web app
export const CLOUDINARY_CLOUD = 'jhayatelier';
export const CLOUDINARY_PRESET = 'iseberestaurant';
