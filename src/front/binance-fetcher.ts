import { customElement, html, LitElement, property, query } from "lit-element";
import '@material/mwc-dialog'
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-textfield'
import { TextField } from "@material/mwc-textfield";
import '@material/mwc-circular-progress'
import { nothing } from "lit-html";
import '@material/mwc-slider'
import { PairsKlines } from "../pairs";
import { fetchPairKlines } from "../binance";
import ms from 'ms'
import { round, wait } from "../util";
import '@material/mwc-icon-button'

@customElement('binance-fetcher')
export class BinanceFetcher extends LitElement {
  // @property({type:Array})
  private assets = ['USDT'];

  @property({type:Number})
  private days = 180;

  @property({type:Boolean})
  private fetching = false;
  @property({type:Number})
  private progression = 0;

  @query('mwc-dialog') dialog!: Dialog;
  render () {
    return html`
    <mwc-dialog heading="Fetcher" escapeKeyAction="" scrimClickAction=""
        @opened="${e => this.shadowRoot!.querySelector('mwc-slider')!.layout()}">
      <div>
        <mwc-textfield label="assets"
          value="${this.assets.join(', ')}"
          @change="${(e) => this.onAssetsChange(e)}"></mwc-textfield>
        <p>days</p>
        <mwc-slider min="1" max="180" step="1" pin markers
          style="width:100%;"
          @change="${e => this.days = e.target.value}"
          value="${this.days}"></mwc-slider>

        <p style="color:red;font-weight:500">Fetching massive amount of data from Binance can result in a temporary IP ban.<br>
        Do not spam the API.</p>

        <div>
          ${this.fetching ? html`
          <div style="display:flex;align-items:center;margin:24px 0;">
            <mwc-circular-progress indeterminate style="margin-right:18px;"></mwc-circular-progress>
            <span style="font-size:21px;font-weight:500">progression : ${this.progression}%</span>
          </div>
          ` : nothing}
        </div>
      </div>

      ${!this.fetching ? html`<mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>` : nothing }
      <mwc-button unelevated slot="secondaryAction"
        @click="${() => this.onFetchButtonClick()}">${this.fetching ? 'cancel' : 'fetch'}</mwc-button>
    </mwc-dialog>
    `
  }

  private onAssetsChange(e: Event) {
    this.assets = (e.target as TextField).value.split(',').map(v => v.trim())
  }

  private async onFetchButtonClick() {
    if (this.fetching) {
      if (window.confirm('are you sure to cancel the fetch?')) {
        this.fetching = false;
      }
      return
    }
    this.fetching = true;
    this.progression = 0;

    // start fetching
    // first the pairs
    await window.app.updateBinancePairs()
    // then we fetch each pair's klines
    const candidates = window.app.getCandidates(this.assets)
    const pairs: PairsKlines = {}
    let i = 1;
    for (const candidate of candidates) {
      if (!this.fetching) { return /* canceled */ }
      pairs[candidate] = await fetchPairKlines(fetch, candidate, 'd', Date.now() - ms(`${this.days}d`))
      this.progression = round((i * 100) / candidates.length)
      await wait(50)
      i++;
    }
    window.app.pairsKlines = pairs;
    window.app.updateData();
    this.fetching = false;
  }

  show() {
    this.dialog.show()
  }
}