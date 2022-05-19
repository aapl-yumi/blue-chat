import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router";
const { App: CapApp } = Plugins;

const AppUrlListener: React.FC<any> = () => {
  const history = useHistory();
  useEffect(() => {
    CapApp.addListener("appUrlOpen", (data: any) => {
      const slug = data.url.split(".org").pop();
      if (slug) {
        history.push(slug);
      }
    });
  }, [history]);

  return null;
};

export default AppUrlListener;
