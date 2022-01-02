import { css, html, LitElement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { parseKlines, volume_index } from '../klines';
import { getPairsNameObjectFromName } from '../pairs';
import { goToCryptowatch } from './util';

@customElement('volume-view')
export class VolumeView extends LitElement {
  static styles = css`
      .tag {
        display: inline-block;
        padding: 2px 5px;
        background-color: #d9d9d9;
        margin: 4px;
        border-radius: 5px;
        cursor: pointer;
      }
  `

  render () {
    if (window.app.rawData === undefined) return nothing

    const volumes = Object.entries(window.app.rawData)
      .map<[string, number[]]>(([pair, klines]) => [pair, parseKlines(klines).map(k => k[volume_index])])

    const winners: string[][] = []
    ;[6, 5, 4, 3].forEach(width => {
      winners[width] = volumes.filter(([_, vols]) => {
        const progressive = JSON.stringify(vols.slice(-width)) === JSON.stringify(vols.slice(-width).sort((a, b) => a - b))
        if (progressive) {
          console.log(JSON.stringify(vols.slice(-width)), JSON.stringify(vols.slice(-width).sort((a, b) => a - b)))
        }
        return progressive
      })
      .map(([pair, _]) => pair)
    })

    const widths = Object.getOwnPropertyNames(winners).filter(n => n !== 'length').sort((a, b) => parseInt(b) - parseInt(a))

    return widths.map(width => {
      return html`
      <div>
      <b>${width} in a row</b>
      <div style="display:flex;flex-wrap:wrap;">
      ${winners[width].map(winner => html`<span class="tag" @click=${() => this.goToCryptowatch(winner)}>${winner}</span>`)}
      </div>
      </div>
      `
    })
  }

  private goToCryptowatch(winner: any) {
    const {s, q} = getPairsNameObjectFromName(window.app.binancePairs, winner)!
    goToCryptowatch(s, q)
  }
}