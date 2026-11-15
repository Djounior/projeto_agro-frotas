import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';


const firebaseConfig = {
  apiKey: "AIzaSyBFNfpCwFuoLzHMJ7bFT-TSAkRTfdlvlYo",
  authDomain: "agrofrota-25e78.firebaseapp.com",
  projectId: "agrofrota-25e78",
  storageBucket: "agrofrota-25e78.firebasestorage.app",
  messagingSenderId: "1067551562709",
  appId: "1:1067551562709:web:fd6fee79fa589897323b5c",
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
function criarDb() {
  try {
    return initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    return getFirestore(app); // fast refresh: já foi inicializado
  }
}

export const db = criarDb();
export const auth = criarAuth();
//export const db = getFirestore(app);


