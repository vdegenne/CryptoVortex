import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getPairsNameObjectFromName } from "../pairs";
import globalStyles from "./globalStyles";
import { goToCryptowatch } from "./util";

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
      goToCryptowatch(s, q)
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