import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Login from "../components/Login";
import Home from "../components/Home";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function LoginSetup() {
  const { userData, sleepData } = useContext(Context);
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
  }, [auth]);
  useEffect(() => {}, [userData, sleepData]);
  return (
    <div className="login-setup">
      {/* {userData.name == "" ? <Login /> : <Home />} */}
      {isLoggedIn ? <Home /> : <Login />}
    </div>
  );
}

export default LoginSetup;
