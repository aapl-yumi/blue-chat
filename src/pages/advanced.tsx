import React, { useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonItem,
  IonText,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";

import { useShowTab, ShowTab } from "../contexts/showTabContext";
import { App } from "@capacitor/app";

import { checkDarkMode } from "../assets/assets";
import { useTranslation } from "react-i18next";

const Advanced: React.FC = () => {
  async function init() {
    await checkDarkMode();
  }

  init();

  const { showTab, setShowTab } = useShowTab();

  const versionRef = useRef<HTMLIonTextElement>(null);
  useIonViewWillEnter(async () => {
    setShowTab(ShowTab.False);

    const { version } = await App.getInfo();
    versionRef.current!.textContent = version;
  });

  useIonViewWillLeave(() => {
    setShowTab(ShowTab.True);
  });

  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("Settings")} />
          </IonButtons>
          <IonTitle>Advanced</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Advanced</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonText>App Version</IonText>
            <IonText ref={versionRef} slot="end"></IonText>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Advanced;
