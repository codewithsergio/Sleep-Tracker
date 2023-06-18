import { signInWithGoogle } from "../firebase/firebase-config";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import "../styles/Login.css";
import {
  UserCredential,
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";

function Login() {
  const { dispatch } = useContext(Context);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("Testing user data: ");
  const signUsIn = async () => {
    const googleResult: UserCredential | null = await signInWithGoogle();
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    const user = auth.currentUser;
    // Check if login was successful
    if (user && googleResult) {
      const name = user?.displayName;
      const email = user?.email;
      const uid = user?.uid;

      // Create new document in firebase if
      // first time logging in.
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setDoc(docRef, {
          name: name,
          email: email,
          uid: uid,
          sleepTimeDict: {},
          timeWokeUpList: [],
        });
      }
      const currentUserData = docSnap.data();
      console.log(currentUserData);
      if (currentUserData !== undefined && currentUserData != null) {
        dispatch({
          type: "UPDATE_USER_DATA",
          payload: {
            name: currentUserData.name,
            email: currentUserData.email,
            uid: currentUserData.uid,
          },
        });
        dispatch({
          type: "UPDATE_SLEEP_DATA",
          payload: {
            sleepTimeDict: currentUserData.sleepTimeDict,
            timeWokeUpList: currentUserData.timeWokeUpList,
          },
        });
      } else {
        dispatch({
          type: "UPDATE_USER_DATA",
          payload: {
            name: name,
            email: email,
            uid: uid,
          },
        });
        dispatch({
          type: "UPDATE_SLEEP_DATA",
          payload: {
            sleepTimeDict: {},
            timeWokeUpList: [],
          },
        });
      }
    } else {
      console.log("Google sign in failed...");
    }
  };

  const gatherFirebaseData = async () => {
    if (isLoggedIn) {
      return;
    }
    setIsLoggedIn(true);
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    const user = auth.currentUser;

    if (user) {
      const name = user?.displayName;
      const email = user?.email;
      const uid = user?.uid;

      // Create new document in firebase if
      // first time logging in.
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setDoc(docRef, {
          name: name,
          email: email,
          uid: uid,
          sleepTimeDict: {},
          timeWokeUpList: [],
        });
      }
      const currentUserData = docSnap.data();
      console.log(currentUserData);
      if (currentUserData !== undefined && currentUserData != null) {
        dispatch({
          type: "UPDATE_USER_DATA",
          payload: {
            name: currentUserData.name,
            email: currentUserData.email,
            uid: currentUserData.uid,
          },
        });
        dispatch({
          type: "UPDATE_SLEEP_DATA",
          payload: {
            sleepTimeDict: currentUserData.sleepTimeDict,
            timeWokeUpList: currentUserData.timeWokeUpList,
          },
        });
      } else {
        dispatch({
          type: "UPDATE_USER_DATA",
          payload: {
            name: name,
            email: email,
            uid: uid,
          },
        });
        dispatch({
          type: "UPDATE_SLEEP_DATA",
          payload: {
            sleepTimeDict: {},
            timeWokeUpList: [],
          },
        });
      }
    } else {
      console.log("Persistance Login failed...");
    }
  };

  //

  useEffect(() => {
    gatherFirebaseData();
  }, []);

  //
  return (
    <div className="login-page">
      <h1>My Sleep Routine</h1>
      <button onClick={signUsIn}>Login</button>
    </div>
  );
}

export default Login;
