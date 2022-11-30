import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Map } from '../maps'
import { ageFunction } from "../monitoring-functions";
import { round } from "../util";
import globalStyles from "./globalStyles";
import { MonitoringApp } from './monitoring-app.js';

@customElement('age-view')
export class AgeView extends LitElement {
  private app: MonitoringApp;

  constructor (app: MonitoringApp) {
    super()
    this.app = app;
  }

  static styles = css`
  .tag {
    cursor: pointer;
    padding: 9px;
    border-radius:3px;
    background-color:grey;
    color:white;
  }
  `

  render () {
    if (this.app.klines == undefined) {
      this.app.initialFetchComplete.then(() => this.requestUpdate())
      return nothing;
    }

    const result: string[][] = []

    for (let length = 1; length < 60; length++) {
      for (const [pair, klines] of Object.entries(this.app.klines)) {
        if (klines.length == length) {
          if (result[length] === undefined) {
            result[length] = []
          }
          result[length].push(pair)
        }
      }
    }

  //   for (let l = 0; l < 100; l++) {
  // return sortMap(Object.entries(pairs).filter(o => {
  //   if (argv.equal) {
  //     return o[1].length <= argv.age
  //   }
  //   else {
  //     return o[1].length < argv.age
  //   }
  // })
  // .map(([pair, o]) => [pair, o.length]), true)
  //   }


    return html`
    <div style="padding:12px 48px 64px">
    ${result.map((pairs, length) => {
      return html`
      <div style="margin:24px">
        <span style="font-weight:bold;font-size:24px;margin-right:12px;">${length}</span>
        ${pairs.map(pairName => html`<span class="tag" @click=${() => {this.app.goToCryptowatch(pairName)}}>${pairName}</span>`)}
      </div>
      `
    })}
    </div>
    `
  }
}