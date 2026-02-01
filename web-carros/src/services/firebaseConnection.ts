
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 


const firebaseConfig = {
    apiKey: "AIzaSyDpbkM9a37SrpOdxgSAHEFlRxLyfSoec2E",
    authDomain: "webcarros-6d928.firebaseapp.com",
    projectId: "webcarros-6d928",
    storageBucket: "webcarros-6d928.firebasestorage.app",
    messagingSenderId: "365629930384",
    appId: "1:365629930384:web:f34d07b4c79a0ab707d115",
    measurementId: "G-RSP0M7ZX4Z"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }