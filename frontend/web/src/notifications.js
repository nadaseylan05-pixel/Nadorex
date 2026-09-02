// import { getToken } from "firebase/app-check";

// import { messaging } from "./firebase";
// const VAPID_KEY = "AIzaSyBqe10shHHYdyJO5NVr855GHKwjk1G-euo";

// export async function requestNotificationPermission() {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("Notification permission denied");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//     });

//     console.log("FCM TOKEN:", token);

//     return token;
//   } catch (error) {
//     console.error("FCM ERROR:", error);
//     return null;
//   }
// }
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = "BI9gb1EL24FECezz0zbm9-rv55XD7czgC94a7aNF1Hy3k51z55C4_C85l2xMY-dWEpL3lAdjXA46VgdvIi07ldI";
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission:", permission);
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    console.log("Service Worker registered:", registration);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);

    if (token) {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/register-token/`,
        // "http://localhost:8000/api/notifications/register-token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            fcm_token: token,
          }),
        }
      );

      const data = await response.json();

      console.log("FCM TOKEN REGISTER:", data);
    }

    return token;
  } catch (error) {
    console.error("FCM ERROR:", error);
    return null;
  }
}
