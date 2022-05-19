import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";

import { useShowTab, ShowTab } from "../contexts/showTabContext";

import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";

import { checkDarkMode, SettingsRootState } from "../assets/assets";

import { useTranslation } from "react-i18next";

const Privacy: React.FC = () => {
  var settings = useSelector((state: SettingsRootState) => state);
  const dispatch = useDispatch();
  const { readReceipts, typingIndicators } = bindActionCreators(
    actionCreators,
    dispatch
  );

  async function init() {
    await checkDarkMode();
  }

  const { setShowTab } = useShowTab();

  useIonViewWillEnter(async () => {
    setShowTab(ShowTab.False);
    init();
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
          <IonTitle>Privacy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Privacy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel>Read receipts</IonLabel>
            <IonToggle
              checked={settings.readReceipts}
              onIonChange={async (e) => {
                readReceipts(e.detail.checked);
                await Storage.set({
                  key: "settings",
                  value: JSON.stringify(settings),
                });
              }}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Typing indicators</IonLabel>
            <IonToggle
              checked={settings.typingIndicators}
              onIonChange={async (e) => {
                typingIndicators(e.detail.checked);
                await Storage.set({
                  key: "settings",
                  value: JSON.stringify(settings),
                });
              }}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Privacy;
