import { settingsInitialState as initialState } from "../../assets/assets";

const settingsReducer = (
  state = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case "typingIndicators":
      return {
        ...state,
        typingIndicators: action.payload,
      };
    case "readReceipts":
      return {
        ...state,
        readReceipts: action.payload,
      };
    case "changeSettings":
      return action.payload;
    default:
      return state;
  }
};

export default settingsReducer;
