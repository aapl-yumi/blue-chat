export const readReceipts = (setting: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "readReceipts",
      payload: setting,
    });
  };
};

export const typingIndicators = (setting: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "typingIndicators",
      payload: setting,
    });
  };
};

export const changeSettings = (setting: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "changeSettings",
      payload: setting,
    });
  };
};
