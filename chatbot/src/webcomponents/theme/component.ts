import styles from "./styles.scss?raw";
export class ThemeElement extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "closed" });
  constructor() {
    super();
    var sheet = new CSSStyleSheet();
    sheet.replace(styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = "<slot></slot>";
  }
}
