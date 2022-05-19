import React, { useRef, useState } from "react";
import {
  IonContent,
  IonInput,
  IonPage,
  IonButton,
  useIonViewWillEnter,
  IonSlide,
  IonSlides,
  IonIcon,
  IonChip,
  IonRippleEffect,
  useIonLoading,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { Keyboard, KeyboardStyle, KeyboardResize } from "@capacitor/keyboard";
import { Clipboard } from "@capacitor/clipboard";
import * as ChatsDatabase from "../assets/database/ChatsDatabase";
import { Trans, useTranslation } from "react-i18next";
import ListOfWords from "../assets/listofwords.json";
import { arrowForward, copy } from "ionicons/icons";

const Signup: React.FC = () => {
  const Parse = require("parse");

  Keyboard.setAccessoryBarVisible({ isVisible: false });
  Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });

  const [bluechatid, setBlueChatId] = useState<string>("");
  const [code, setCode] = useState<string[]>([]);
  const [codeString, setCodeString] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  useIonViewWillEnter(async () => {
    document.body.classList.toggle("dark", true);
    Keyboard.setStyle({ style: KeyboardStyle.Dark });
    await Storage.clear();
    const db = await ChatsDatabase.get();
    await db.remove();
    setBlueChatId(makeRandomId());
    randomRandomCode();
  });

  const { t } = useTranslation();

  const makeRandomId = (length = 36) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };

  const randomRandomCode = () => {
    const alrused: number[] = [];
    const result: string[] = [];
    const wordlist = ListOfWords.data;
    for (let i = 0; i < 12; i++) {
      const random = Math.floor(Math.random() * wordlist.length);
      if (alrused.indexOf(random) === -1) {
        alrused.push(random);
        result.push(wordlist[random]);
      }
    }
    setCode(result);
  };

  const copyCodeToClipboard = async () => {
    let content = "";
    code.forEach((i) => {
      content += `${i} `;
    });
    setCodeString(content);
    await Clipboard.write({ string: content });
  };

  async function signup() {
    presentLoading("Signing up...");
    const newuser = new Parse.User();
    newuser.set("bluechatid", bluechatid);
    const SHA256 = require("crypto-js/sha256");
    const encryptedpassword = SHA256(codeString).toString();
    newuser.set("password", encryptedpassword);
    newuser.set("username", bluechatid);
    await newuser
      .signUp()
      .then(async function (user: { get: (arg0: string) => string }) {
        alert("Account was successfully made!");
        await Storage.set({
          key: "bluechatid",
          value: bluechatid,
        });
        await Storage.set({
          key: "userid",
          value: JSON.parse(JSON.stringify(user)).objectId,
        });
        console.info(
          `User created successfully with bluechatid: ${user.get("bluechatid")}`
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
      .catch((error: { code: string; message: string }) => {
        console.info(`Error: ${error.code} ${error.message}`);
        if (error.code === "202") {
          alert("This username is already used.");
        }
      });
    dismissLoading();
  }

  const [presentLoading, dismissLoading] = useIonLoading();

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  const slidesref = useRef<HTMLIonSlidesElement>(null);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSlides pager={true} options={slideOpts} ref={slidesref}>
          <IonSlide>
            <p>
              <Trans>By signing up, you agree to our</Trans>&nbsp;
              <a href="https://bluelock.org/terms">
                <Trans>Terms of Service</Trans>
              </a>
              .
            </p>
            <IonButton onClick={() => slidesref.current?.slideNext()}>
              <Trans>Sign up</Trans>
              <IonIcon slot="end" icon={arrowForward} />
              <IonRippleEffect />
            </IonButton>
            <p>
              Already have an account?&nbsp;
              <a href="./login" style={{ textDecoration: "none" }}>
                <Trans>Log in</Trans>
              </a>
            </p>
          </IonSlide>
          <IonSlide>
            <h1>
              <Trans>Your Blue Chat ID</Trans>
            </h1>
            <h2
              className="break-word"
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "7px",
                width: "90%",
              }}
            >
              {bluechatid}
            </h2>
          </IonSlide>
          <IonSlide>
            <h1>Your code to sign in</h1>
            <div className="signupcodecontainer">
              {code.map((i) => {
                return <IonChip>{i}</IonChip>;
              })}
            </div>
            <IonButton onClick={copyCodeToClipboard} color="dark">
              <Trans>Copy to clipboard</Trans>
              <IonIcon icon={copy} />
              <IonRippleEffect />
            </IonButton>
          </IonSlide>
          <IonSlide>
            <h1>Type the code</h1>
            <div className="signupcodecontainer">
              <IonInput onIonChange={(e) => setCodeInput(e.detail.value!)} />
            </div>
            <IonButton
              disabled={codeString === codeInput ? false : true}
              color="dark"
              onClick={signup}
            >
              <Trans>Let's Go!</Trans>
            </IonButton>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
