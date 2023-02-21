import firebase, { initializeApp } from "firebase/app"
import "firebase/auth"
import { getAuth } from "firebase/auth"

const config = {
    apiKey: process.env.REACT_APP_api_key,
    authDomain: process.env.REACT_APP_auth_domain,
    projectId: process.env.REACT_APP_project_id,
    storageBucket: process.env.REACT_APP_storage_bucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appid
}

export const firebaseauth = initializeApp(config);
