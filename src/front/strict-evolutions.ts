import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-slider'
import globalStyles from "./globalStyles";
import { strictEvolutions } from "../monitoring-functions";
import './pair-button'
import { Map } from "../maps";
import { round } from "../util";
import { customElement, property } from 'lit/decorators.js';
import { html, LitElement, nothing } from 'lit';
import { MonitoringApp } from './monitoring-app.js';

@customElement('strict-evolutions')
export class StrictEvolutions extends LitElement {
  private app: MonitoringApp;

  @property({type:Boolean,reflect:true})
  private ascending = false;

  constructor (app: MonitoringApp) {
    super()
    this.app = app;
  }

  render () {
    if (this.app.klines == undefined) {
      this.app.initialFetchComplete.then(() => {
        this.requestUpdate()
      })
      return nothing
    }

    const results: Map[] = []

    for (const length of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      results[length] =
        strictEvolutions(this.app.klines, {
          days: length,
          minDays: 10,
          size: 1000,
          ascending: this.ascending
        })
    }

    return html`
    <div style="display:flex;flex-direction:column-reverse;max-width:500px;margin:0 auto;">
    ${results.map((l, length) => {
      if (l.length == 0) { return nothing }
      return html`
      <div>
        <h2>${length}</h2>
        ${l.map(r => {
          return html`<pair-button name="${r[0]}" value="${round(r[1])}%" colors></pair-button>`
        })}
      </div>`
    })}
    </div>
    `
  }
}