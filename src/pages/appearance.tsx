import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonButton,
  IonPopover,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { RGBColor, ChromePicker } from "react-color";

import { useShowTab, ShowTab } from "../contexts/showTabContext";

import {
  checkDarkMode,
  AppearanceForm,
  capFirst,
  contrastingColor,
  convertrgba,
  appearanceSettingsInitialState,
} from "../assets/assets";

import { AppIcon } from "@capacitor-community/app-icon";
import main from "../assets/alternate-icons/main.png";
import monotone from "../assets/alternate-icons/monotone.png";
import light from "../assets/alternate-icons/light.png";
import old from "../assets/alternate-icons/old.png";
import lightMono from "../assets/alternate-icons/light-mono.png";
import neon from "../assets/alternate-icons/neon.png";
import { useTranslation } from "react-i18next";

const Appearance: React.FC = () => {
  async function init() {
    await checkDarkMode();
  }

  init();

  const { showTab, setShowTab } = useShowTab();

  useIonViewWillEnter(async () => {
    setShowTab(ShowTab.False);
    getCurrentAppIcon();
  });

  useIonViewWillLeave(() => {
    setShowTab(ShowTab.True);
  });

  const appearanceSettings: AppearanceForm[] = appearanceSettingsInitialState;

  function handleColorChange(color: RGBColor) {
    setfocusedcolor(color);
  }

  const [focusedcolor, setfocusedcolor] = useState<RGBColor>({} as RGBColor);
  const [showModal, setShowModal] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const changeIcon = async (iconName: string) => {
    await AppIcon.change({ name: iconName, suppressNotification: false });
    getCurrentAppIcon();
    setShowPopover({ showPopover: false, event: undefined });
  };

  const [currentAppIcon, setCurrentAppIcon] = useState(main);
  const getCurrentAppIcon = async () => {
    const currentAppIconName: string =
      (await AppIcon?.getName()).value || "main";
    if (currentAppIconName === "main") {
      setCurrentAppIcon(main);
    } else if (currentAppIconName === "monotone") {
      setCurrentAppIcon(monotone);
    } else if (currentAppIconName === "light") {
      setCurrentAppIcon(light);
    } else if (currentAppIconName === "old") {
      setCurrentAppIcon(old);
    }
  };

  const alternateAppIconsList = [
    { name: "main", src: main, alt: "Normal" },
    { name: "monotone", src: monotone, alt: "Monotone" },
    { name: "light", src: light, alt: "Light" },
    { name: "light-mono", src: lightMono, alt: "Light Mono" },
    { name: "neon", src: neon, alt: "Neon" },
    { name: "old", src: old, alt: "Kami" },
  ];

  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("Settings")} />
          </IonButtons>
          <IonTitle>Appearance</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Appearance</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonModal isOpen={showModal}>
          <IonContent scrollY={false}>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowModal(false)}>
                    Cancel
                  </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    Save
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <div className={"center fullwidth"}>
              <ChromePicker
                color={focusedcolor}
                onChange={(c) => handleColorChange(c.rgb)}
              />
            </div>
          </IonContent>
        </IonModal>
        <IonContent>
          <IonList>
            <IonPopover
              event={popoverState.event}
              isOpen={popoverState.showPopover}
              onDidDismiss={() => {
                setShowPopover({ showPopover: false, event: undefined });
              }}
            >
              <IonList>
                {alternateAppIconsList.map((icon, index) => {
                  return (
                    <IonItem onClick={() => changeIcon(icon.name)}>
                      <IonLabel>{icon.alt}</IonLabel>
                      <div className={"alternateAppIcons"}>
                        <img src={icon.src} alt={icon.alt} />
                      </div>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonPopover>
            <IonItem
              onClick={(e: any) => {
                e.persist();
                setShowPopover({ showPopover: true, event: e });
              }}
            >
              <IonLabel>App Icon</IonLabel>
              <div className={"alternateAppIcons"}>
                <img src={currentAppIcon} alt="App Icon" />
              </div>
            </IonItem>
          </IonList>
          <IonList>
            {appearanceSettings.map((i) => {
              return (
                <IonItem
                  onClick={() => {
                    setfocusedcolor(i.color);
                    setShowModal(true);
                  }}
                >
                  <IonLabel>{capFirst(i.name)}</IonLabel>
                  <div
                    style={{
                      backgroundColor: convertrgba(i.color),
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      border: "solid 1px " + contrastingColor(i.color),
                    }}
                  ></div>
                </IonItem>
              );
            })}
          </IonList>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Appearance;
