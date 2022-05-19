import React, { useState } from "react";
import {
  IonContent,
  IonInput,
  IonPage,
  IonButton,
  IonLoading,
  useIonViewWillEnter,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { Keyboard, KeyboardStyle, KeyboardResize } from "@capacitor/keyboard";
import * as ChatsDatabase from "../assets/database/ChatsDatabase";
import { useTranslation } from "react-i18next";
import ListOfWords from "../assets/listofwords.json";

const Signup: React.FC = () => {
  var Parse = require("parse");

  Keyboard.setAccessoryBarVisible({ isVisible: false });
  Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  useIonViewWillEnter(async () => {
    document.body.classList.toggle("dark", true);
    Keyboard.setStyle({ style: KeyboardStyle.Dark });
    await Storage.clear();
    const db = await ChatsDatabase.get();
    await db.remove();
  });

  const { t } = useTranslation();

  async function signup() {
    setShowLoading(true);
    if (!username || !password) {
      alert(t("Please fill in both your username and password."));
    } else if (password.length < 8) {
      alert(t("Passwords have to be longer than 8 letters."));
    } else {
      var newuser = new Parse.User();
      newuser.set("username", username);
      var SHA256 = require("crypto-js/sha256");
      const encryptedpassword = SHA256(password).toString();
      newuser.set("password", encryptedpassword);
      await newuser
        .signUp()
        .then(async function (user: { get: (arg0: string) => string }) {
          alert("Account was successfully made!");
          await Storage.set({
            key: "username",
            value: username,
          });
          await Storage.set({
            key: "userid",
            value: JSON.parse(JSON.stringify(user)).objectId,
          });
          console.info(
            "User created successfully with username: " + user.get("username")
          );
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
          console.error("Error: " + error.code + " " + error.message);
          if ((error.code = "202")) {
            alert("This username is already used.");
          }
        });
    }
    setShowLoading(false);
  }

  const [showLoading, setShowLoading] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-container" style={{ height: window.outerHeight }}>
          <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={t("Please wait")}
            duration={5000}
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
          <p>
            By signing up, you agree to our&nbsp;
            <a href="https://bluelock.org/terms">Terms of Service</a>.
          </p>
          <IonButton onClick={() => signup()}>Sign up</IonButton>
          <p>
            Already have an account?&nbsp;
            <a href="./login" style={{ textDecoration: "none" }}>
              Login!
            </a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
