// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
export {};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdAIUTthNcGgMxxfDlbFZ1l9YwcZfE8Gg",
  authDomain: "quasardiscord-bot.firebaseapp.com",
  databaseURL: "https://quasardiscord-bot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quasardiscord-bot",
  storageBucket: "quasardiscord-bot.appspot.com",
  messagingSenderId: "535334704589",
  appId: "1:535334704589:web:ce7cef6d1d32ac69062084"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

export { db }
