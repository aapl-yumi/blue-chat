import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";

import { useShowTab, ShowTab } from "../contexts/showTabContext";

import { checkDarkMode } from "../assets/assets";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
  async function init() {
    await checkDarkMode();
  }

  init();

  const { showTab, setShowTab } = useShowTab();

  useIonViewWillEnter(async () => {
    setShowTab(ShowTab.False);
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
          <IonTitle>About Bluelock Org</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">About Bluelock Org</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <IonText>
            <h1>We value your privacy.</h1>
            <h4>That is why we make services just like Blue Chat.</h4>
            <h2>
              Our mission is to{" "}
              <b>
                Provide privacy respecting, free to use, open source, and easy
                to use services with good UI and UX.
              </b>
            </h2>
            <h3>
              We only want to give people choices. We are not forcing people to
              use our services, we only recommend. We want you to have freedom
              and be your true selves.
            </h3>
            <h4>
              Check more information about us on{" "}
              <a href="https://bluelock.org">https://bluelock.org</a>.
            </h4>
          </IonText>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default About;
