import React, { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonLoading,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { Keyboard, KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";
import * as ChatsDatabase from "../assets/database/ChatsDatabase";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  var Parse = require("parse");

  Keyboard.setAccessoryBarVisible({ isVisible: false });
  Keyboard.setStyle({ style: KeyboardStyle.Dark });
  Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
  const loginContainer = useRef<HTMLDivElement>(null);

  document.body.classList.toggle("dark", true);

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  useIonViewWillEnter(async () => {
    await Storage.clear();
    const db = await ChatsDatabase.get();
    await db.remove();
  });

  const { t } = useTranslation();

  async function login() {
    setShowLoading(true);
    if (!username || !password) {
      alert(t("Please fill in both your username and password."));
    } else if (password.length < 8) {
      alert(t("Passwords have to be longer than 8 letters."));
    } else {
      var SHA256 = require("crypto-js/sha256");
      const encryptedpassword = SHA256(password).toString();
      await Parse.User.logIn(username, encryptedpassword, { usePost: true })
        .then(async function (user: any) {
          console.info("Logged in with name: " + user.get("username"));
          await Storage.set({
            key: "username",
            value: username,
          });
          await Storage.set({
            key: "userid",
            value: JSON.parse(JSON.stringify(user)).objectId,
          });
          const setDark = async () => {
            await Storage.set({
              key: "darkmode",
              value: "dark",
            });
          };
          setDark();
          window.location.href = "/setup";
        })
        .catch(function (error: { code: string; message: string }) {
          alert(error.message);
          console.error("Error: " + error.code + " " + error.message);
        });
    }
    setShowLoading(false);
  }

  const [showLoading, setShowLoading] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className="login-container"
          style={{ height: window.innerHeight }}
          ref={loginContainer}
        >
          <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={t("Please wait")}
          />
          <IonInput
            autofocus
            required
            value={username}
            placeholder={t("Username")}
            onIonChange={(e) => setusername(e.detail.value!)}
          ></IonInput>
          <IonInput
            type={"password"}
            required
            value={password}
            placeholder={t("Password")}
            onIonChange={(e) => setpassword(e.detail.value!)}
          ></IonInput>
          <IonButton onClick={() => login()}>Login</IonButton>
          <p>
            Don't have account yet?&nbsp;
            <a href="./signup" style={{ textDecoration: "none" }}>
              Sign up!
            </a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
