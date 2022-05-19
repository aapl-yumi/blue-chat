import React, { useRef, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  chatbubble as chatbubbleIcon,
  settings as settingsIcon,
} from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./pages/main.css";

import Chats from "./pages/chats";
import Chat from "./pages/chat";
import Settings from "./pages/settings";
import Account from "./pages/account";
import Privacy from "./pages/privacy";
import Advanced from "./pages/advanced";
import About from "./pages/about";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Start from "./pages/start";
import Setup from "./pages/setup";
import Appearance from "./pages/appearance";
import AppUrlListener from "./pages/AppUrlListener";

import { ShowTabContext, ShowTab } from "./contexts/showTabContext";

import { Storage } from "@capacitor/storage";

import parseinfo from "./parseinfo";

const App: React.FC = () => {
  const Parse = require("parse");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function init() {
    const { value }: any = await Storage.get({ key: "username" });
    if (value) {
      setIsLoggedIn(true);
    }
  }

  init();

  Parse.initialize(parseinfo.AppID, parseinfo.JSKey);
  Parse.serverURL = "https://parseapi.back4app.com/";

  const [showTab, setShowTab] = React.useState(ShowTab.True);
  const tabStyle =
    showTab === "True" ? { display: "flex" } : { display: "none" };

  const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);

  return (
    <ShowTabContext.Provider value={{ showTab, setShowTab }}>
      <IonApp>
        <IonReactRouter>
          <AppUrlListener />
          {isLoggedIn ? (
            <IonTabs>
              <IonRouterOutlet ref={routerRef}>
                <Route path="/chats" component={Chats} exact />
                <Route
                  path="/chat/:id"
                  render={(props) => (
                    <Chat {...props} router={routerRef.current} />
                  )}
                  exact
                />
                <Route path="/settings" component={Settings} exact />
                <Route
                  path="/settings/account"
                  render={(props) => (
                    <Account {...props} router={routerRef.current} />
                  )}
                  exact
                />
                <Route path="/settings/privacy" component={Privacy} exact />
                <Route path="/settings/advanced" component={Advanced} exact />
                <Route path="/settings/about" component={About} exact />
                <Route
                  path="/settings/appearance"
                  component={Appearance}
                  exact
                />
                <Route path="/setup" component={Setup} exact />
                <Redirect exact from="/" to="/chats/" />
                <Redirect exact from="/start" to="/chats/" />
              </IonRouterOutlet>
              <IonTabBar slot="bottom" style={tabStyle}>
                <IonTabButton tab="chats" href="/chats">
                  <IonIcon icon={chatbubbleIcon} />
                </IonTabButton>
                <IonTabButton tab="settings" href="/settings">
                  <IonIcon icon={settingsIcon} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          ) : (
            <IonRouterOutlet>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/start" component={Start} />
              <Redirect exact from="/" to="/start" />
            </IonRouterOutlet>
          )}
        </IonReactRouter>
      </IonApp>
    </ShowTabContext.Provider>
  );
};

export default App;
