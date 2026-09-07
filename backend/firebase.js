// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get, remove } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZVqmfda3Jj445BFjINXytM7cxOtDxHl4",
  authDomain: "vinayagar-pooja.firebaseapp.com",
  databaseURL: "https://vinayagar-pooja-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vinayagar-pooja",
  storageBucket: "vinayagar-pooja.firebasestorage.app",
  messagingSenderId: "1042758056429",
  appId: "1:1042758056429:web:6e990852b6fc480ea20fe4",
  measurementId: "G-ES37YDQTX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref, set, get, remove };