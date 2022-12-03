import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-slider'
import globalStyles from "./globalStyles";
import { pairsEvolutions } from "../monitoring-functions";
import './pair-button'
import { Map } from "../maps";
import { round } from "../util";
import { customElement, property, state } from 'lit/decorators.js';
import { html, LitElement, nothing } from 'lit';
import { MonitoringApp } from './monitoring-app.js';

@customElement('percents-view')
export class PercentsView extends LitElement {
  private app: MonitoringApp;

  @property({type:Boolean,reflect:true})
  private croissant = false;

  @state()
  private length = 100;

  // @property({type:Array})
  // private results: Map = [];

  // static styles = [
  //   globalStyles
  // ]

  constructor (app: MonitoringApp) {
    super()
    this.app = app;
  }

  render () {
    if (this.app.klines == undefined) {
      this.app.initialFetchComplete.then(() => this.requestUpdate())
      return nothing;
    }

    const results = pairsEvolutions(this.app.klines, {
      days: this.length,
      size: 1000,
      croissant: this.croissant
    })

    return html`
    <div style="max-width:700px;margin:0 auto">
      <p>Length</p>
      <mwc-slider
        pin markers discrete withTickMarks
        max=${this.app.fetchInfos.width} min=1 step=1
        @change=${e => this.length = e.target.value}
        value="${this.length}"></mwc-slider>

      ${results.map(r => {
        return html`<pair-button name="${r[0]}" value="${round(r[1])}%" colors></pair-button>`
      })}
    </div>
    `
  }

  layoutSlider () {
    this.shadowRoot!.querySelector(`mwc-slider`)?.layout()
  }
}