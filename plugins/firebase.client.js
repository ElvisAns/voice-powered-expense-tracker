import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin(() => {
    const { $config } = useNuxtApp();
    const firebaseConfig = {
      apiKey: $config.public.firebaseApiKey,
      authDomain: $config.public.firebaseAuthDomain,
      projectId: $config.public.firebaseProjectId,
      storageBucket: $config.public.firebaseStorageBucket,
      messagingSenderId: $config.public.firebaseMessagingSenderId,
      appId: $config.public.firebaseAppId,
      measurementId: $config.public.firebaseMeasurementId
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const analytics = getAnalytics(app);
    return {
        provide: {
            'firebase': app,
            'auth': auth,
            'db': db,
            'analytics': analytics,
        }
    }
});

