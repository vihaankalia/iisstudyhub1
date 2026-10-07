import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa0_5KivwD5XQ5EK4r7Hbduk57srGkrhU",
  authDomain: "symmetric-flames-l3n78.firebaseapp.com",
  projectId: "symmetric-flames-l3n78",
  storageBucket: "symmetric-flames-l3n78.firebasestorage.app",
  messagingSenderId: "874790130782",
  appId: "1:874790130782:web:c0398da258b7d29830d0cf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-adb1e21a-f0da-479a-995c-9c455d3bd312");

// Validate Firestore Connection as per Firebase Skill rules
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firestore client appears offline or check configuration:", error.message);
    }
  }
}
testFirestoreConnection();

export { app, auth, db };
