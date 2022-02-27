const firebaseConfig = {
    apiKey: "AIzaSyC36U7HG06X1nQkzg_vXQTbxRua0QL2T3s",
    authDomain: "waitless-ba7ec.firebaseapp.com",
    projectId: "waitless-ba7ec",
    storageBucket: "waitless-ba7ec.appspot.com",
    messagingSenderId: "701519562176",
    appId: "1:701519562176:web:b7b104a469345023253425",
    measurementId: "G-B2PVV0YMK3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // cloud firestore
const fb_auth = firebase.auth();