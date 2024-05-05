// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "senicare.firebaseapp.com",
  projectId: "senicare",
  storageBucket: "senicare.appspot.com",
  messagingSenderId: "206383548601",
  appId: "1:206383548601:web:435d75e4d36bfd2219f368",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

/* 
fire base rule:
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if 
      request.resource.size < 2*1024*1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}


new rule bc error occured:
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Temporarily allow unrestricted read and write access
      allow read, write;
    }
  }
}

*/