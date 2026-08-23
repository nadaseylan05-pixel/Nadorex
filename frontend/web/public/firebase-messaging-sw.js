importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBqe10shHHYdyJO5NVr855GHKwjk1G-euo",
  authDomain: "nadorex-90275.firebaseapp.com",
  projectId: "nadorex-90275",
  storageBucket: "nadorex-90275.firebasestorage.app",
  messagingSenderId: "372998960964",
  appId: "1:372998960964:web:79fd2add5b3d3d59954911"
});

const messaging = firebase.messaging();

// importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
// // import { messaging } from "../src/firebase";

// const VAPID_KEY = "AIzaSyBqe10shHHYdyJO5NVr855GHKwjk1G-euo";

// export async function requestNotificationPermission() {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("Notification permission:", permission);
//       return null;
//     }

//     const registration = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js"
//     );

//     console.log("Service Worker registered:", registration);

//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//       serviceWorkerRegistration: registration,
//     });

//     console.log("FCM TOKEN:", token);

//     return token;
//   } catch (error) {
//     console.error("FCM ERROR:", error);
//     return null;
//   }
// }