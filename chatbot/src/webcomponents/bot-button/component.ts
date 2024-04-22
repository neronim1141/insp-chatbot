import styles from "./styles.scss?raw";

const createContainer = () => {
  const container = document.createElement("div");
  container.className = "chatbot-container";
  container.appendChild(document.createElement("slot"));

  return container;
};

export class BotButtonElement extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "closed" });
  chatbotContainer = createContainer();
  open = false;
  constructor() {
    super();
    var sheet = new CSSStyleSheet();
    sheet.replace(styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
  toggle() {
    this.open = !this.open;
    if (this.open) {
      this.chatbotContainer.classList.add("show");
    } else {
      this.chatbotContainer.classList.remove("show");
    }
  }

  connectedCallback() {
    const button = document.createElement("div");
    button.className = "bot-button avatar";
    button.onclick = () => this.toggle();

    this.shadowRoot.append(this.chatbotContainer, button);
  }
}
