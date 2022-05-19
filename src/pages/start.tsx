import React from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonImg,
  useIonViewWillEnter,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Device } from "@capacitor/device";
import "./main.css";
import chatlogo from "../assets/images/blue-chat-logo.png";
import i18n from "../i18n";
import { Trans } from "react-i18next";

const Start: React.FC = () => {
  const setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };
  setStatusBarStyleDark();

  document.body.classList.toggle("dark", true);

  useIonViewWillEnter(() => {
    changeLanguage("en");
    Device.getLanguageCode().then((result: { value: string }) => {
      changeLanguage(result.value).then(() => {});
    });
  });

  const changeLanguage = async (lng: string) => {
    await Storage.set({ key: "language", value: lng });
    i18n.changeLanguage(lng);
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <div className="start-container">
          <IonImg src={chatlogo} />
          <IonButton href="./signup">
            <Trans>Sign up</Trans>
          </IonButton>
          <IonButton href="./login">
            <Trans>Log in</Trans>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Start;
