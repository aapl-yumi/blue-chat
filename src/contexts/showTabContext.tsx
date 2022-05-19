import { createContext, useContext } from "react";

export enum ShowTab {
  True = "True",
  False = "False",
}

export type ShowTabContextType = {
  showTab: ShowTab;
  setShowTab: (ShowTab: ShowTab) => void;
};

export const ShowTabContext = createContext<ShowTabContextType>({
  showTab: ShowTab.True,
  setShowTab: (showTab) => console.warn("no showTab provider"),
});

export const useShowTab = () => useContext(ShowTabContext);
