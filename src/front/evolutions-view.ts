import { customElement, html, LitElement, property } from "lit-element";
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-slider'
import globalStyles from "./globalStyles";
import { pairsEvolutionScores } from "../monitoring-functions";
import './pair-button'
import { Map } from "../maps";
import { round } from "../util";

@customElement('evolutions-view')
export class EvolutionsView extends LitElement {
  @property({type:Boolean,reflect:true})
  private croissant = false;

  @property({type: Number})
  private days = 5;

  @property({type: Number})
  private minDays = 10;

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
      <span>Days</span><mwc-icon title="Nombre de bougies (à partir du jour actuel)">help_outline</mwc-icon>
    </div>
    <mwc-slider max="100" min="1" step="1" pin markers
      @change="${e => this.days = e.target.value}"
      value="${this.days}"></mwc-slider>

    <div class="flex">
      <span>Minimun Days</span><mwc-icon title="Nombre de jours que le cours doit posséder">help_outline</mwc-icon>
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
      return html`<pair-button name="${r[0]}" value="${round(r[1])}"></pair-button>`
    })}
    </div>
    `
  }

  private onCalculateClick() {
    this.results = pairsEvolutionScores(window.app.data, {
      days: this.days,
      minDays: this.minDays,
      size: this.size,
      croissant: this.croissant
    })
  }
}