import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-slider'
import globalStyles from "./globalStyles";
import { pairsEvolutions, strictEvolutions } from "../monitoring-functions";
import './pair-button'
import { Map } from "../maps";
import { round } from "../util";
import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

@customElement('strict-evolutions')
export class StrictEvolutions extends LitElement {
  @property({type:Boolean,reflect:true})
  private ascending = false;

  @property({type: Number})
  private days = 5;

  @property({type: Number})
  private minDays = 5;

  @property({type: Number})
  private size = 10;

  @property({type:Array})
  private results: Map = [];

  static styles = [
    globalStyles
  ]

  render () {
    return html`
    <div class="flex">
      <span>Days</span><mwc-icon title="nombre de bougies (à partir du jour actuel)">help_outline</mwc-icon>
    </div>
    <mwc-slider max="100" min="1" step="1" pin markers
      @change="${e => this.days = e.target.value}"
      value="${this.days}"></mwc-slider>

    <div class="flex">
      <span>minDays</span><mwc-icon title="number of days minimum the pairs has to have.">help_outline</mwc-icon>
    </div>
    <mwc-slider max="100" min="1" step="1" pin markers
      @change="${e => this.minDays = e.target.value}"
      value="${this.minDays}"></mwc-slider>

    <div class="flex">
      <span>Size</span><mwc-icon title="Taille de la liste finale">help_outline</mwc-icon>
    </div>
    <mwc-slider max="40" min="1" step="1" pin markers
      @change="${(e) => this.size = e.target.value}"
      value="${this.size}"></mwc-slider>

    <mwc-button unelevated
      @click="${() => this.onCalculateClick()}">calculate</mwc-button>

    <div id="results">
    ${this.results.map(r => {
      return html`<pair-button name="${r[0]}" value="${round(r[1])}%" colors></pair-button>`
    })}
    </div>
    `
  }

  private onCalculateClick() {
    this.results = strictEvolutions(window.app.kObjects!, {
      days: this.days,
      minDays: this.minDays,
      size: this.size,
      ascending: this.ascending
    })
  }
}