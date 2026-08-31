interface AppConfigType {
  storageMethod: string;
  n8n_webhook_url: string;
  translateUrl: string;
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
  storageMethod: import.meta.env.NG_APP_STORAGE_METHOD,
  n8n_webhook_url: import.meta.env['NG_APP_N8N_WEBHOOK_URL'],
  translateUrl: 'https://api.mymemory.translated.net/get',
  firebaseConfig: {
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.NG_APP_FIREBASE_MEASUREMENT_ID,
  },
}