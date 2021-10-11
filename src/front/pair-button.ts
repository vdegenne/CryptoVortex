import { css, customElement, html, LitElement, property } from "lit-element";
import { getPairsNameObjectFromName } from "../pairs";
import { round } from "../util";
import globalStyles from "./globalStyles";
import { visitBinance } from "./util";

@customElement('pair-button')
export class PairButton extends LitElement {
  @property({type:Boolean,reflect:true})
  private colors = false;

  @property({type:Boolean})
  private ATH = false;

  @property()
  private name;

  @property()
  private value;

  constructor() {
    super()
    this.addEventListener('click', e => {
      const { s, q } = getPairsNameObjectFromName(window.app.binancePairs, this.name)!
      visitBinance(s, q)
    })
  }

  static styles = [
    globalStyles,
    css`
    :host {
      display: flex;
      align-items: center;
      background-color: grey;
      cursor: pointer;
      margin: 4px;
    }
    `
  ]

  render () {
    return html`
    <div id="name">${this.name}</div>
    <div id="value" ?colors="${this.colors}" ?greater="${parseInt(this.value) > 0}">${this.value}</div>
    `
  }
}