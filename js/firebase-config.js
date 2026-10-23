// Firebase web app configuration. These values are not passwords.
const firebaseConfig = {
  apiKey: "AIzaSyAb0-_I8Jk7GCF7c_w7fWo86iuAxIJvJ6M",
  authDomain: "newaz-portfolio-26332.firebaseapp.com",
  projectId: "newaz-portfolio-26332",
  storageBucket: "newaz-portfolio-26332.firebasestorage.app",
  messagingSenderId: "33304567518",
  appId: "1:33304567518:web:ccc9fa1ca7b28ee9312c4f"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
