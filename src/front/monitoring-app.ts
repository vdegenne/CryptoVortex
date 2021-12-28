import {css, customElement, html, LitElement, property, query} from 'lit-element'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import './percents-view'
import './evolutions-view'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import {Checkbox} from '@material/mwc-checkbox'
// import data from '../../dumps/pairs-klines.json'
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKobjects, PairName, popLastDays, PairsKlines } from '../pairs';
import { filterPairsKlinesFromCandidates } from '../filters';
import { fetchBinancePairs, fetchLocalBinancePairs, fetchLocalPairsKlines } from './util'
import './binance-fetcher'
import { BinanceFetcher } from './binance-fetcher'
import { TextField } from '@material/mwc-textfield'
import './strict-evolutions'
import './age-view'

declare global {
  interface Window {
    app: MonitoringApp;
  }
}

@customElement('monitoring-app')
export class MonitoringApp extends LitElement {
  private assets = ['USDT']
  private removeLastDays = false;

  @property({type:Array})
  public binancePairs: PairName[] = [];

  private binanceFetcher = new BinanceFetcher()

  @property({type: Number})
  public tabIndex = 0;

  public pairsKlines?: PairsKlines;
  public data!: PairsKobjects;

  @query('mwc-textfield[label=assets]') assetsTextField!: TextField;

  constructor() {
    super()

    fetchLocalBinancePairs().then(async (pairs) => {
      // When the application first start
      // we get the local data for fast rendering
      this.binancePairs = pairs;
      this.pairsKlines = await fetchLocalPairsKlines()
      this.updateData()
    })

    window.app = this;
  }

  static styles = css`
  :host {
    display: block;
    /* max-width: 800px; */
    margin: 0 auto;
  }
  mwc-tab-bar {
    background-color: #eeeeee;
  }
  .view {
    display: block;
    overflow:hidden;
    height:0;
  }
  .view[show] {
    overflow: initial;
    height: initial;
  }
  `

  render () {
    return html`
    <div style="display:flex;align-items:center;justify-content:space-between">
      <mwc-textfield label="assets" value="${this.assets.join(',')}"
        helper="pairs available: ${this.binancePairs.length}"
        helperPersistent
        @change="${() => this.onAssetsChange()}"></mwc-textfield>
      <mwc-formfield label="remove incomplete current day">
        <mwc-checkbox
          @click="${(e) => this.onRemoveIncompleteLastDays(e)}"></mwc-checkbox>
      </mwc-formfield>
      <mwc-icon-button icon="cloud_download"
        @click="${() => this.binanceFetcher.show()}"></mwc-icon-button>
    </div>

    <mwc-tab-bar style="margin: 30px 0;"
        @MDCTabBar:activated="${e => {
          this.tabIndex = e.detail.index
        }}">
      <mwc-tab label="% negatif"></mwc-tab>
      <mwc-tab label="% positif"></mwc-tab>
      <mwc-tab label="chutes (scores)"></mwc-tab>
      <mwc-tab label="montées (scores)"></mwc-tab>
      <mwc-tab label="strict ascendings"></mwc-tab>
      <mwc-tab label="strict descendings"></mwc-tab>
      <mwc-tab label="age"></mwc-tab>
    </mwc-tab-bar>

    <percents-view class="view" ?show="${this.tabIndex === 0}" croissant></percents-view>
    <percents-view class="view" ?show="${this.tabIndex === 1}"></percents-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 2}" croissant></evolutions-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 3}"></evolutions-view>
    <strict-evolutions class="view" ?show="${this.tabIndex === 4}" ascending></strict-evolutions>
    <strict-evolutions class="view" ?show="${this.tabIndex === 5}"></strict-evolutions>
    <age-view class="view" ?show="${this.tabIndex === 6}"></age-view>

    ${this.binanceFetcher}
    `
  }

  private onRemoveIncompleteLastDays(e: Event) {
    const target = e.target as Checkbox;
    setTimeout(() => {
      this.removeLastDays = target.checked
      this.updateData()
      this.requestUpdate()
    }, 200)
  }

  private onAssetsChange() {
    this.assets = this.assetsTextField.value.split(',')
    this.updateData()
    this.requestUpdate()
  }

  public updateData () {
    this.data = convertPairsKlinesToPairsKobjects(
      filterPairsKlinesFromCandidates(
        this.pairsKlines!,
        this.getCandidates(this.assets)
      )
    )
    if (this.removeLastDays) {
      popLastDays(this.data)
    }
  }

  public getCandidates (assets: string[]) {
    return getCandidatePairs(this.binancePairs, assets, assets)
  }

  public async updateBinancePairs () {
    this.binancePairs = await fetchBinancePairs()
  }
}