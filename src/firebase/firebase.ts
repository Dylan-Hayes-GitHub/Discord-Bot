import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDdAIUTthNcGgMxxfDlbFZ1l9YwcZfE8Gg",
    authDomain: "quasardiscord-bot.firebaseapp.com",
    databaseURL: "https://quasardiscord-bot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quasardiscord-bot",
    storageBucket: "quasardiscord-bot.appspot.com",
    messagingSenderId: "535334704589",
    appId: "1:535334704589:web:9c8c33f6099c255b062084"
  };

const app = initializeApp(firebaseConfig);


export default app;