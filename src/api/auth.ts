import { firebase } from "./firebase";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    User as IUser
} from "firebase/auth";

const auth = getAuth(firebase);

export const signInFb = async (email: string, password: string) => {
    return new Promise<string>((resolve, rejected) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user.uid);
            })
            .catch((error) => { rejected(error) })
        }
    )
};

export const signOutFb = async () => auth.signOut();

export const signUpFb = async (email: string, password: string) => {
    return new Promise<string>((resolve, rejected) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user.uid);
            })
            .catch((error) => { rejected(error) })
    });
};

export const subscribeAuthStateChangedFb = (onSignedIn: Function, onSignedOut: Function) => (
    onAuthStateChanged(
        auth,
        (user: IUser | null) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                onSignedIn();
                console.log(`${user.uid} sign in`);
            } else {
                // User is signed out
                onSignedOut();
                console.log('User sign out');
            }
        }
    )
);