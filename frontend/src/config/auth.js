// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjgR6DWLGWCvftihUD1gJCiO2pPU0t34I",
  authDomain: "final-project-97ee6.firebaseapp.com",
  projectId: "final-project-97ee6",
  storageBucket: "final-project-97ee6.firebasestorage.app",
  messagingSenderId: "573860449000",
  appId: "1:573860449000:web:7f2f3a1519ced1cb54575d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth