import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  useIonViewWillEnter,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

import { useTranslation, Trans } from "react-i18next";
import { languageList } from "../assets/assets";

const Settings: React.FC = () => {
  const [darkmodeSetting, setdarkmodeSetting] = useState("");

  const setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  const setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  async function init() {
    const { value } = await Storage.get({ key: "darkmode" });
    setdarkmodeSetting(value || "system");
    if (value === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      document.body.classList.toggle("dark", prefersDark.matches);
      if (prefersDark.matches) {
        setStatusBarStyleDark();
      } else {
        setStatusBarStyleLight();
      }
    } else {
      document.body.classList.toggle("dark", value === "dark" ? true : false);
      if (value === "dark") {
        Keyboard.setStyle({ style: KeyboardStyle.Dark });
        setStatusBarStyleDark();
      } else {
        Keyboard.setStyle({ style: KeyboardStyle.Light });
        setStatusBarStyleLight();
      }
    }
  }

  useIonViewWillEnter(() => {
    init();
  });

  async function setDarkMode(dark: string) {
    setdarkmodeSetting(dark);
    if (dark === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      document.body.classList.toggle("dark", prefersDark.matches);
      if (prefersDark.matches) {
        setStatusBarStyleDark();
      } else {
        setStatusBarStyleLight();
      }
    } else {
      document.body.classList.toggle("dark", dark === "dark" ? true : false);
      if (dark === "dark") {
        Keyboard.setStyle({ style: KeyboardStyle.Dark });
        setStatusBarStyleDark();
      } else {
        Keyboard.setStyle({ style: KeyboardStyle.Light });
        setStatusBarStyleLight();
      }
    }
    await Storage.set({
      key: "darkmode",
      value: dark,
    });
  }

  const { i18n } = useTranslation();
  const changeLanguage = async (lng: string) => {
    await Storage.set({ key: "language", value: lng });
    i18n.changeLanguage(lng);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Trans>Settings</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <Trans>Settings</Trans>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem routerLink="/settings/account">
            <IonLabel>
              <Trans>Account</Trans>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/privacy">
            <IonLabel>
              <Trans>Privacy</Trans>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/appearance">
            <IonLabel>
              <Trans>Appearance</Trans>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/advanced">
            <IonLabel>
              <Trans>Advanced</Trans>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/about">
            <IonLabel>
              <Trans>About</Trans>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Language</Trans>
            </IonLabel>
            <IonSelect
              value={i18n.language}
              placeholder="Select One"
              interface="popover"
              onIonChange={(e) => changeLanguage(e.detail.value)}
            >
              {languageList.map((lang) => (
                <IonSelectOption value={lang.lang} key={lang.lang}>
                  {lang.emoji + lang.langinlang}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Theme</Trans>
            </IonLabel>
            <IonSelect
              value={darkmodeSetting}
              placeholder="Select One"
              interface="popover"
              onIonChange={(e) => setDarkMode(e.detail.value)}
            >
              <IonSelectOption value="dark">
                <Trans>Dark</Trans>
              </IonSelectOption>
              <IonSelectOption value="light">
                <Trans>Light</Trans>
              </IonSelectOption>
              <IonSelectOption value="system">
                <Trans>System</Trans>
              </IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
