import { App } from "@capacitor/app";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Clipboard } from "@capacitor/clipboard";
import { Storage } from "@capacitor/storage";
import {
  IonActionSheet,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  ellipsisHorizontalOutline,
  informationCircleOutline,
  sendOutline,
} from "ionicons/icons";
import React, { useRef, useState } from "react";
import Hammer from "react-hammerjs";
import { Trans, useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";

import { checkDarkMode } from "../assets/assets";
import defaultProfile from "../assets/images/default-profile.png";
import { ShowTab, useShowTab } from "../contexts/showTabContext";

import "./main.css";

interface ChatPageProps
  extends RouteComponentProps<{
    id: string;
  }> {
  router: HTMLIonRouterOutletElement | null;
}

const Chat: React.FC<ChatPageProps> = ({ match, router }) => {
  const Parse = require("parse");
  const Messages = Parse.Object.extend("Messages");

  const { t } = useTranslation();

  const dayjs = require("dayjs");
  const relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);

  const [bluechatid, setBluechatid] = useState("");

  async function subscribeForNewMessages() {
    const messagesLiveQuery = new Parse.Query("Messages");
    messagesLiveQuery.equalTo("to", bluechatid);
    messagesLiveQuery.equalTo("from", bluechatid); // TODO change to match.param.id
    const messagesLiveQuerySubscription = await messagesLiveQuery.subscribe();
    messagesLiveQuerySubscription.on("create", (message: any) => {
      setChatList([...chatList, message]);
    });
  }

  async function init() {
    await checkDarkMode();
    setBluechatid(await Parse.User.current().get("bluechatid"));
    ionContentRef.current!.scrollToBottom();
    ionListRef.current!.style.marginBottom = `${
      ionInputRef.current!.clientHeight + 3
    }px`;
  }

  const { setShowTab } = useShowTab();

  const [typeMessage, setTypeMessage] = useState("");

  useIonViewWillEnter(() => {
    setShowTab(ShowTab.False);
    init();
  });

  useIonViewWillLeave(() => {
    setShowTab(ShowTab.True);
  });

  async function sendMessage() {
    const message = new Messages();
    const content = {
      message: typeMessage,
      hasAttachment: false,
      attachment: "",
    };
    message.set("content", JSON.stringify(content));
    message.set("to", bluechatid); // TODO change to match.param.id
    message.set("from", bluechatid);
    const { version } = await App.getInfo();
    message.set("sender_version", version);
    message
      .save()
      .then(() => {
        console.info("Message sent");
        setTypeMessage("");
      })
      .catch((error: { message: string }) => {
        console.error(`Error: ${error.message}`);
      });
  }

  const [chatList, setChatList] = useState([
    {
      id: "1",
      message:
        "hello hello hello hello hello hello hello hello hellohellohellohellohellohellohellohellohello",
      time: 1616701928002,
      from: "Eme8SwqkpM",
    },
    { id: "2", message: "hello", time: 1616701928002, from: "Eme8SwqkpM" },
    {
      id: "3",
      message:
        "hello hello hello hello hello hello hello hello hellohellohellohellohellohellohellohellohello",
      time: 1616701928002,
      from: "83r6geRARg",
    },
    { id: "4", message: "hello", time: 1616701928002, from: "Eme8SwqkpM" },
    { id: "5", message: "hello", time: 1616701928002, from: "83r6geRARg" },
    { id: "6", message: "hello", time: 1616701928002, from: "Eme8SwqkpM" },
    { id: "7", message: "hello", time: 1616701928002, from: "83r6geRARg" },
    { id: "8", message: "hello", time: 1616701928002, from: "Eme8SwqkpM" },
    { id: "9", message: "hello", time: 1616701928002, from: "83r6geRARg" },
    {
      id: "10",
      message:
        "hello hello hello hello hello hello hello hello hellohellohellohellohellohellohellohellohello hellohellohellohellohellohellohellohellohello hello hello hello hello hello hello hello hello hellohellohellohellohellohellohellohellohello hellohellohellohellohellohellohellohellohello",
      time: 1616701928002,
      from: "83r6geRARg",
    },
  ]);

  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const ionListRef = useRef<HTMLIonListElement>(null);
  const ionInputRef = useRef<HTMLIonTextareaElement>(null);

  const [showAttachmentActionSheet, setShowAttachmentActionSheet] =
    useState(false);
  const [imgSrc, setImgSrc] = useState("");

  const [presentMessageActionSheet, dismissMessageActionSheet] =
    useIonActionSheet();

  function openTextActionSheet(_message: any) {
    presentMessageActionSheet({
      buttons: [
        {
          text: "Copy Text",
          handler: () => {
            Clipboard.write({ string: _message.message });
          },
        },
        {
          text: "Reply",
          handler: () => {
            console.log("reply clicked");
          },
        },
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            deleteMessage(_message);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
  }

  async function deleteMessage(_message: any) {}

  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/chats" text={t("Chats")} />
          </IonButtons>
          <IonTitle>{match.params.id}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setShowProfileModal(true);
              }}
            >
              <IonIcon icon={informationCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={ionContentRef}>
        <IonList ref={ionListRef}>
          {chatList.map((i) => {
            return (
              <Hammer onPress={() => openTextActionSheet(i)} key={i.id}>
                <div className="message-content" id={`trigger-${i.id}`}>
                  <div className="message-sender">
                    <div className="message-profile">
                      <img src={defaultProfile} alt={i.from} />
                    </div>
                    <div className="message-name">
                      <IonLabel>{i.from}</IonLabel>
                    </div>
                    <div className="message-time">
                      <IonLabel>{dayjs(i.time).fromNow()}</IonLabel>
                    </div>
                  </div>
                  <div className="message-message">{i.message}</div>
                </div>
              </Hammer>
            );
          })}
        </IonList>
        {imgSrc ? (
          <div>
            <IonImg src={imgSrc} />
          </div>
        ) : (
          ""
        )}
        <IonActionSheet
          isOpen={showAttachmentActionSheet}
          onDidDismiss={() => setShowAttachmentActionSheet(false)}
          buttons={[
            {
              text: "Add a photo",
              handler: async () => {
                const image = await Camera.getPhoto({
                  quality: 90,
                  allowEditing: false,
                  resultType: CameraResultType.Base64,
                });

                const imageUri = image.base64String;

                setImgSrc(imageUri || "");
              },
            },
            {
              text: "Files",
              handler: () => {
                console.log("Play clicked");
              },
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ]}
        />
      </IonContent>
      <IonFooter>
        <div className="chatInput">
          <IonTextarea
            ref={ionInputRef}
            autoGrow={true}
            value={typeMessage}
            placeholder="Message..."
            inputmode="text"
            spellcheck={true}
            wrap="soft"
            onIonChange={(e) => setTypeMessage(e.detail.value!)}
          />
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setShowAttachmentActionSheet(true)}
          >
            <IonIcon icon={ellipsisHorizontalOutline} />
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            disabled={!typeMessage}
            onClick={sendMessage}
          >
            <IonIcon icon={sendOutline} />
          </IonButton>
        </div>
      </IonFooter>
      <IonModal
        isOpen={showProfileModal}
        canDismiss={true}
        presentingElement={router || undefined}
        onDidDismiss={() => setShowProfileModal(false)}
      >
        <IonContent>
          <IonImg className="profile-image" />
          <IonItem>
            <IonLabel>
              <Trans>Username</Trans>: {match.params.id}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <Trans>Email</Trans>: {match.params.id}
            </IonLabel>
          </IonItem>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Chat;
