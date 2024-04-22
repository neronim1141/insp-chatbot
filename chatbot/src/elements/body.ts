import { tags, text } from "spellcaster/hyperscript.js";
import { MessageModel, MessagesStore } from "../state";
import { computed, effect } from "spellcaster/spellcaster.js";
const [state] = MessagesStore;
const { div, p } = tags;

const ChatBubble = (
  { text: textContent, sender }: MessageModel,
  isFirst: boolean
) => {
  const chatBotMessage = div({ className: "chatbot-message" });
  for (let textNode of textContent.split("\n")) {
    chatBotMessage.append(p({}, text(textNode)));
  }
  return div(
    {
      className:
        "chatbot-bubble last" +
        (isFirst ? " first" : "") +
        (sender === "bot" ? " bot" : " user"),
    },
    [div({ className: "avatar" }), chatBotMessage]
  );
};

export const Body = () => {
  const body = div({ className: "chatbot-body" });
  const messages = computed(() => state().messages);
  let childs: HTMLElement[] = [];
  const sortedMessages = computed(() =>
    Array.from(messages().values()).sort((a, b) => a.time - b.time)
  );
  effect(() => {
    const newMessage = sortedMessages().at(-1);
    const previousMessage = sortedMessages().at(-2);
    const previousMessageElement = childs.at(-1);
    if (newMessage) {
      const newSender = newMessage.sender !== previousMessage?.sender;
      const message = ChatBubble(
        newMessage,
        previousMessage ? newSender : true
      );
      if (!newSender) {
        previousMessageElement?.classList.remove("last");
      }
      childs.push(message);

      body.append(message);
      body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
    }
  });
  return body;
};
