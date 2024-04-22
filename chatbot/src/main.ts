import { BotButtonElement } from "./webcomponents/bot-button/component";
import { ChatElement } from "./webcomponents/chat/component";
import { ThemeElement } from "./webcomponents/theme/component";

customElements.define("insp-chat", ChatElement);
customElements.define("insp-bot-button", BotButtonElement);
customElements.define("insp-theme", ThemeElement);
