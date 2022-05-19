import {
  IonAvatar,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { add, chatboxEllipses, qrCode } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import React, { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { checkDarkMode } from "../assets/assets";
import * as ChatsDatabase from "../assets/database/ChatsDatabase";
import defaultprofile from "../assets/images/default-profile.png";

import Parse from "parse";

const Chats: React.FC = () => {
  const dayjs = require("dayjs");
  const relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);

  const [chatsList, setChatsList] = useState<
    {
      chatId: string;
      name: string;
      lastMessage: {
        mes: string;
        time: number;
      };
      profileImage: string;
    }[]
  >([]);

  const [subs, setSubs] = useState<any[]>([]);

  useIonViewWillEnter(async () => {
    await init();
    await checkDarkMode();

    await Parse.Cloud.run("getMessagesForUser").then((_res: any) => {
      if (_res === "No results") {
        console.info("No results");
      } else {
        _res.forEach((_mes: any) => {
          console.log(_mes.attributes);
        });
      }
    });
  });

  async function doRefresh(_event: CustomEvent<RefresherEventDetail>) {
    await checkDarkMode();
    await init();
    _event.detail.complete();
  }

  useIonViewWillLeave(async () => {
    subs.forEach((sub) => sub.unsubscribe());
  });

  async function init() {
    const db = await ChatsDatabase.get();
    try {
      await db.chatslist
        .find()
        .exec()
        .then((chats: any) => {
          setChatsList(chats);
        });
    } catch (e) {
      console.error(e);
    }
    const sub = await db.chatslist.find().$.subscribe((chats: any) => {
      if (!chats) {
        return;
      }
      setChatsList(
        chats.sort((a: any, b: any) => {
          return b.lastMessage.time - a.lastMessage.time;
        })
      );
    });
    setSubs(subs.concat(sub));
  }

  function random(length: number) {
    return Math.random()
      .toString(16)
      .slice(2, length + 2);
  }

  async function newChat() {
    const db = await ChatsDatabase.get();
    try {
      const rand = random(10);
      await db.chatslist.insert({
        chatId: rand,
        lastMessage: {
          mes: "Id: " + rand,
          // time: 1615950159062,
          time: new Date().getTime(),
        },
        name: "Yumi",
        profileImage: "",
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function removeChat(id: string) {
    const db = await ChatsDatabase.get();
    try {
      await db.chatslist
        .findOne({
          selector: {
            chatId: id,
          },
        })
        .exec()
        .then((chat: any) => {
          chat.remove();
        });
    } catch (e) {
      console.error(e);
    }
    closeSliding();
  }

  const ionListRef = useRef<HTMLIonListElement>(null);
  const ionSlidingRef = useRef<HTMLIonItemSlidingElement>(null);
  function closeSliding() {
    ionListRef.current?.closeSlidingItems();
    ionSlidingRef.current?.closeOpened();
  }

  const [searchText, setSearchText] = useState("");

  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Trans>Chats</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        scrollEvents
        onIonScrollStart={() => closeSliding()}
      >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <Trans>Chats</Trans>
            </IonTitle>
          </IonToolbar>
          <IonSearchbar
            value={searchText}
            placeholder={t("Search")}
            onIonChange={(e) => setSearchText(e.detail.value!)}
          />
        </IonHeader>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonList ref={ionListRef}>
          {chatsList.map((_chatInfo) => (
            <IonItemSliding ref={ionSlidingRef} key={_chatInfo.chatId}>
              <IonItemOptions side="start">
                <IonItemOption
                  color="warning"
                  onClick={() => console.log("pinned")}
                >
                  Pin
                </IonItemOption>
              </IonItemOptions>
              <IonItem routerLink={`/chat/${_chatInfo.chatId}`}>
                <IonAvatar slot="start">
                  <IonImg
                    src={_chatInfo.profileImage || defaultprofile}
                    class="chatsProfile"
                  />
                </IonAvatar>
                <IonLabel>
                  <h2>{_chatInfo.name}</h2>
                  <p>{_chatInfo.lastMessage.mes}</p>
                </IonLabel>
                <IonNote slot="end">
                  <p>{dayjs(_chatInfo.lastMessage.time).fromNow()}</p>
                </IonNote>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={async () => removeChat(_chatInfo.chatId)}
                  expandable
                >
                  Delete
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={async () => newChat()}>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton>
              <IonIcon icon={qrCode} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={chatboxEllipses} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Chats;
