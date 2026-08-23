// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging} from "firebase/messaging";
import { getToken } from "firebase/app-check";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqe10shHHYdyJO5NVr855GHKwjk1G-euo",
  authDomain: "nadorex-90275.firebaseapp.com",
  projectId: "nadorex-90275",
  storageBucket: "nadorex-90275.firebasestorage.app",
  messagingSenderId: "372998960964",
  appId: "1:372998960964:web:79fd2add5b3d3d59954911"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export { getToken };