import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonImg,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSlides,
  IonSlide,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";
import { Camera, CameraResultType } from "@capacitor/camera";
import { StatusBar, Style } from "@capacitor/status-bar";
import "./main.css";
import logo from "../assets/images/logo.png";
import slide1left from "../assets/images/slide-1-left.png";
import slide1right from "../assets/images/slide-1-right.png";
import defaultprofile from "../assets/images/default-profile.png";
import { useShowTab, ShowTab } from "../contexts/showTabContext";
import { arrowForward } from "ionicons/icons";
import { checkDarkMode } from "../assets/assets";

import { useTranslation, Trans } from "react-i18next";
import { languageList } from "../assets/assets";

import Cropper from "react-cropper";
import "../assets/cropper.css";

const Setup: React.FC = () => {
  document.body.classList.toggle("dark", true);

  const { setShowTab } = useShowTab();

  useIonViewWillEnter(async () => {
    await Storage.get({ key: "profileImage" }).then((result) => {
      if (typeof result.value === "string") {
        setProfile(result.value);
      }
    });
    setShowTab(ShowTab.False);
    await checkDarkMode();
  });

  useIonViewWillLeave(() => {
    setShowTab(ShowTab.True);
  });

  const setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  const setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  async function setDarkMode(dark: string) {
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

  const [profile, setProfile] = useState("");
  const [cropImage, setCropImage] = useState("");
  const [cropper, setCropper] = useState<any>();
  const [showModal, setShowModal] = useState(false);

  async function setUpProfileImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    var imageUrl = image.webPath;
    setShowModal(true);
    setCropImage(imageUrl || "");
  }

  async function saveProfileImage() {
    if (typeof cropper !== "undefined") {
      setProfile(cropper.getCroppedCanvas().toDataURL());
      await Storage.set({
        key: "profileImage",
        value: cropper.getCroppedCanvas().toDataURL(),
      });
    }
    setShowModal(false);
  }

  const { t, i18n } = useTranslation();
  const changeLanguage = async (lng: string) => {
    await Storage.set({ key: "language", value: lng });
    i18n.changeLanguage(lng);
  };

  const slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <IonSlides pager={true} options={slideOpts}>
          <IonSlide>
            <h1>
              <Trans>Select a language</Trans>
            </h1>
            <IonSelect
              value={i18n.language}
              placeholder={t("Select One")}
              interface="popover"
              onIonChange={(e) => changeLanguage(e.detail.value)}
            >
              {languageList.map((lang) => (
                <IonSelectOption value={lang.lang} key={lang.lang}>
                  {lang.emoji + lang.langinlang}
                </IonSelectOption>
              ))}
            </IonSelect>
            <p>
              <Trans>You can change this later</Trans>
            </p>
          </IonSlide>
          <IonSlide>
            <IonImg src={logo} />
            <h2>
              <Trans>Welcome</Trans>
            </h2>
            <p>
              Blue Chat is a free to use end-to-end encrypted chat app from
              Bluelock Org.
            </p>
          </IonSlide>
          <IonSlide>
            <div className="slide-dark">
              <img
                src={slide1left}
                onClick={() => setDarkMode("light")}
                alt={"light"}
                style={{ width: "50%" }}
              />
              <img
                src={slide1right}
                onClick={() => setDarkMode("dark")}
                alt={"dark"}
                style={{ width: "50%" }}
              />
            </div>
            <h2>
              <Trans>Dark mode</Trans>
            </h2>
            <p>
              <Trans>Setup Dark Mode Description</Trans>
            </p>
          </IonSlide>
          <IonSlide>
            <IonModal isOpen={showModal} canDismiss={true}>
              <IonPage>
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonButton onClick={() => setShowModal(false)}>
                        {t("Back")}
                      </IonButton>
                    </IonButtons>
                    <IonTitle>
                      <Trans>Crop</Trans>
                    </IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={async () => await saveProfileImage()}>
                        {t("Save")}
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent scrollY={false}>
                  <div style={{ width: "100%" }}>
                    <Cropper
                      style={{
                        width: (window.innerWidth * 95) / 100 + "px",
                        height: (window.innerWidth * 95) / 100 + "px",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      minContainerWidth={(window.innerWidth * 95) / 100}
                      minContainerHeight={(window.innerWidth * 95) / 100}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      src={cropImage}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                  </div>
                </IonContent>
              </IonPage>
            </IonModal>
            <div className="default-profile">
              <IonImg
                src={profile || defaultprofile}
                onClick={() => setUpProfileImage()}
              />
            </div>
            <h2>
              <Trans>Set up your profile image</Trans>
            </h2>
          </IonSlide>
          <IonSlide>
            <h1>
              <Trans>Ready to start?</Trans>
            </h1>
            <IonButton href="/">
              <Trans>Continue</Trans>
              <IonIcon slot="end" icon={arrowForward}></IonIcon>
            </IonButton>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Setup;
