import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

let firebaseApp = null;
let auth = null;
let initError = null;

function getFirebaseConfig() {
  const runtimeConfig = window.__AURA_CONFIG__?.firebase;
  if (runtimeConfig) return runtimeConfig;

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
}

function validateFirebaseConfig(config) {
  return Boolean(config?.apiKey && config?.authDomain && config?.projectId && config?.appId);
}

export function initAuthService() {
  if (auth || initError) {
    return { auth, error: initError };
  }

  const config = getFirebaseConfig();
  if (!validateFirebaseConfig(config)) {
    initError = new Error('Firebase config is missing. Add VITE_FIREBASE_* values in .env.local or window.__AURA_CONFIG__.firebase in runtime-config.js.');
    return { auth: null, error: initError };
  }

  firebaseApp = initializeApp(config);
  auth = getAuth(firebaseApp);
  return { auth, error: null };
}

export function getAuthInitError() {
  return initError;
}

export function subscribeToAuthState(callback) {
  const { auth: initializedAuth, error } = initAuthService();
  if (error || !initializedAuth) {
    callback(null, error);
    return () => {};
  }

  return onAuthStateChanged(
    initializedAuth,
    (user) => callback(user, null),
    (error) => callback(null, error)
  );
}

export async function login(email, password) {
  const { auth: initializedAuth, error } = initAuthService();
  if (error || !initializedAuth) throw error;

  return signInWithEmailAndPassword(initializedAuth, email, password);
}

export async function register(email, password) {
  const { auth: initializedAuth, error } = initAuthService();
  if (error || !initializedAuth) throw error;

  return createUserWithEmailAndPassword(initializedAuth, email, password);
}

export async function logout() {
  const { auth: initializedAuth, error } = initAuthService();
  if (error || !initializedAuth) throw error;

  return signOut(initializedAuth);
}

export async function getAuthToken() {
  const { auth: initializedAuth, error } = initAuthService();
  if (error || !initializedAuth) throw error;

  const user = initializedAuth.currentUser;
  if (!user) {
    throw new Error('Please login before continuing.');
  }

  return user.getIdToken();
}
