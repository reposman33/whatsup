const env = (import.meta as any).env;


console.log('🔍 import.meta.env:', env);
console.log('🔍 API key value:', env?.NG_APP_STORAGE_METHOD);
console.log('🔍 API key value:', env.NG_APP_STORAGE_METHOD);
console.log('🔍 API key value:', env?.NG_APP_FIREBASE_API_KEY);
console.log('🔍 API key value:', env.NG_APP_FIREBASE_API_KEY);

interface AppConfigType {
  storageMethod: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}

export const AppConfig: AppConfigType = {
  storageMethod: env.NG_APP_STORAGE_METHOD,
  firebaseConfig: {
    apiKey: env.NG_APP_FIREBASE_API_KEY,
    authDomain: env.NG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NG_APP_FIREBASE_APP_ID,
    measurementId: env.NG_APP_FIREBASE_MEASUREMENT_ID,
    }
}