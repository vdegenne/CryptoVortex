import { customElement, html, LitElement, property } from "lit-element";
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-slider'
import globalStyles from "./globalStyles";
import { pairsEvolutions } from "../monitoring-functions";
import './pair-button'
import { Map } from "../maps";
import { round } from "../util";

@customElement('percents-view')
export class PercentsView extends LitElement {
  @property({type:Boolean,reflect:true})
  private croissant = false;

  @property({type: Number})
  private days = 5;

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
    this.results = pairsEvolutions(window.app.data, {
      days: this.days,
      size: this.size,
      croissant: this.croissant
    })
  }
}