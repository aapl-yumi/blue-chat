import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButtons,
  IonBackButton,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonButton,
  IonImg,
  IonAlert,
  IonModal,
  IonLoading,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";

import { useShowTab, ShowTab } from "../contexts/showTabContext";

import { checkDarkMode } from "../assets/assets";

import { Trans, useTranslation } from "react-i18next";

import { Camera, CameraResultType } from "@capacitor/camera";
import Cropper from "react-cropper";
import "../assets/cropper.css";

import * as ChatsDatabase from "../assets/database/ChatsDatabase";

interface AccountPageProps {
  router: HTMLIonRouterOutletElement | null;
}

const Account: React.FC<AccountPageProps> = ({ router }) => {
  var Parse = require("parse");

  async function init() {
    await checkDarkMode();

    await Storage.get({ key: "username" }).then((result) => {
      if (typeof result.value === "string") {
        setUsername(result.value);
      }
    });

    await Storage.get({ key: "profileImage" }).then((result) => {
      if (typeof result.value === "string") {
        setProfile(result.value);
      }
    });

    setEmail("abc@abc.com");
  }

  init();

  const { setShowTab } = useShowTab();

  useIonViewWillEnter(() => {
    setShowTab(ShowTab.False);
  });

  useIonViewWillLeave(() => {
    setShowTab(ShowTab.True);
  });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const imageUrl = image.webPath;
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

  function signout() {
    setIsLoading(true);
    Parse.User.logOut()
      .then(async () => {
        await Storage.clear();
        const db = await ChatsDatabase.get();
        await db.remove();
        setIsLoading(false);
        window.location.href = "/";
      })
      .catch((error: { code: string; message: string }) => {
        console.error("Error: " + error.code + " " + error.message);
      });
  }

  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("Settings")} />
          </IonButtons>
          <IonTitle>
            <Trans>Account</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={isLoading} message={"Signing out..."} />
        <IonAlert
          isOpen={showAlert}
          header="Are you sure you want to sign out?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                setShowAlert(false);
              },
            },
            {
              text: "Sign out",
              handler: () => {
                signout();
              },
            },
          ]}
        />
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <Trans>Account</Trans>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonImg
          className="profile-image"
          src={profile}
          onClick={() => setUpProfileImage()}
        />
        <IonItem>
          <IonLabel>
            <Trans>Username</Trans>: {username}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <Trans>Email</Trans>: {email}
          </IonLabel>
        </IonItem>
        <div style={{ width: "100%", textAlign: "center", paddingTop: "10px" }}>
          <IonButton color="danger" onClick={() => setShowAlert(true)}>
            Sign out
          </IonButton>
        </div>
      </IonContent>
      <IonModal
        isOpen={showModal}
        canDismiss={true}
        presentingElement={router || undefined}
        onDidDismiss={() => setShowModal(false)}
      >
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
    </IonPage>
  );
};

export default Account;
