import { cid, Identifiable, indexById } from "spellcaster/hyperscript.js";
import { logware, store } from "spellcaster/spellcaster.js";
export interface MessageModel extends Identifiable {
  id: string;
  sender: string;
  time: number;
  text: string;
}

const MessageModel = ({
  id = cid(),
  sender = "bot",
  time = Date.now(),
  text = "",
}): MessageModel => ({
  id,
  time,
  sender,
  text,
});

type AppModel = {
  open: boolean;
  messages: Map<string, MessageModel>;
};

type Action =
  | {
      type: "sendMessage";
      payload: string;
    }
  | {
      type: "toggleOpen";
    };

const update = (state: AppModel, action: Action): AppModel => {
  switch (action.type) {
    case "sendMessage":
      if (action.payload)
        return {
          ...state,
          messages: indexById<string, MessageModel>([
            ...state.messages.values(),
            MessageModel({
              text: action.payload,
              sender: Math.round(Math.random()) == 1 ? "bot" : "user",
            }),
          ]),
        };
      else {
        return state;
      }
    case "toggleOpen":
      return {
        ...state,
        open: !state.open,
      };

    default:
      //@ts-ignore
      console.warn("Unknown message type", action.type);
      return state;
  }
};

export const MessagesStore = store({
  state: {
    open: false,
    messages: new Map<string, MessageModel>(),
  },
  update,
  middleware: logware({ debug: true }),
});
