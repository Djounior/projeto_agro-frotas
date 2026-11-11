import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

type RNPersistenceFactory = (storage: typeof AsyncStorage) => Persistence;

function criarAuth(): Auth {
  if (Platform.OS === 'web') {
    return FirebaseAuth.getAuth(app);
  }
  // No React Native a sessão é persistida no AsyncStorage.
  const fabrica = (FirebaseAuth as unknown as { getReactNativePersistence: RNPersistenceFactory })
    .getReactNativePersistence;
  try {
    return FirebaseAuth.initializeAuth(app, { persistence: fabrica(AsyncStorage) });
  } catch {
    // Fast refresh: o Auth já foi inicializado.
    return FirebaseAuth.getAuth(app);
  }
}

export const auth = criarAuth();
export const db = getFirestore(app);
