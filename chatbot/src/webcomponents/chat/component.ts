import styles from "./styles.scss?raw";
import io from "socket.io-client";

export class ChatElement extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "closed" });
  body = this.getBody();
  header = this.getHeader();
  socket;
  constructor() {
    super();
    var sheet = new CSSStyleSheet();
    sheet.replace(styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.socket = io("http://localhost:3000");
    this.socket.on("connection", () => console.log("connected"));
    this.socket.on("chat message", (msg) => this.addMessage(msg, "bot"));
  }

  getHeader() {
    const header = document.createElement("div");
    header.className = "chatbot-header";
    const avatar = document.createElement("div");
    const text = document.createElement("span");
    text.className = "text";

    text.textContent = "Inspeerity";
    avatar.className = "avatar";

    header.append(avatar);
    header.append(text);
    return header;
  }
  getBody() {
    const body = document.createElement("div");
    body.className = "chatbot-body";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble bot";
    bubble.textContent = "Hi! What are you looking for today?";
    body.append(bubble);
    return body;
  }
  getFooter() {
    const footer = document.createElement("div");
    footer.className = "chatbot-footer";
    const form = document.createElement("form");
    form.className = "chatbot-input";
    const growArea = document.createElement("div");
    growArea.className = "grow-area";
    form.onsubmit = (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      this.sendMessage(target.message.value as string);
      target.reset();
      growArea.dataset.replicatedValue = "";
    };

    const input = document.createElement("textarea");
    input.id = "message-input";
    input.name = "message";
    input.placeholder = "Type your message here...";
    input.autocomplete = "off";
    input.oninput = () => {
      growArea.dataset.replicatedValue = input.value;
    };
    input.onkeydown = (e) => {
      if (e.target && e.key === "Enter" && e.shiftKey === false) {
        const target = e.target as HTMLTextAreaElement;
        e.preventDefault();

        this.sendMessage(target.value);
        target.value = "";
        growArea.dataset.replicatedValue = "";
      }
    };
    const button = document.createElement("button");
    button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="transform: rotate(70deg) scale(1,1.3) translate(1px, -3px);">
            <path fill="currentColor" d="M3.06 19.35c-.24.39-.21.88.06 1.19.27.3.7.38 1.06.19l7.47-4.12 7.47 4.12c.16.09.33.13.5.13.34 0 .67-.15.89-.43.27-.3.3-.78.06-1.19l-7.47-12.36L3.06 19.35z"/>
          </svg>`;
    growArea.append(input);
    form.append(growArea);
    form.append(button);

    footer.append(form);
    return footer;
  }
  sendMessage(message: string) {
    if (!message) return;
    this.socket.emit("chat message", message);
    this.addMessage(message, "user");
  }

  addMessage(message: string, type: "user" | "bot") {
    const bubble = document.createElement("div");
    this.header.classList.add("minimize");
    bubble.className = "chat-bubble " + type;

    for (let textPart of message.split("\n")) {
      const textElement = document.createElement("p");
      textElement.textContent = textPart;
      bubble.append(textElement);
    }
    this.body.append(bubble);
    this.body.scrollTo({ top: this.body.scrollHeight, behavior: "smooth" });
  }

  connectedCallback() {
    const container = document.createElement("div");
    container.className = "chat-container";
    container.append(this.header, this.body, this.getFooter());
    this.shadowRoot.append(container);
  }
  disconnectedCallback() {
    this.socket.disconnect();
  }
}
