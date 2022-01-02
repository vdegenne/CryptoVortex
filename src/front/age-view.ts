import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Map } from '../maps'
import { ageFunction } from "../monitoring-functions";
import { round } from "../util";
import globalStyles from "./globalStyles";

@customElement('age-view')
export class AgeView extends LitElement {

  @property({type:Number})
  private age = 5;

  @property({type:Array})
  private results: Map = [];

  static styles = [
    globalStyles
  ]

  render () {
    return html`
    <p>age (less or equal than ${this.age})</p>
    <mwc-slider max="100" min="1" step="1" pin markers
    @change="${e => this.age = e.target.value}"
    value="${this.age}"></mwc-slider>

    <mwc-button unelevated
      @click="${() => this.onCalculateClick()}">calculate</mwc-button>

    <div id="results">
    ${this.results.map(r => {
      return html`<pair-button name="${r[0]}" value="${round(r[1])}"></pair-button>`
    })}
    </div>
    `
  }

  private onCalculateClick() {
    this.results = ageFunction(window.app.kObjects!, {
      age: this.age,
      equal: true
    })
  }
}