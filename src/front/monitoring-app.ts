import { css, html, LitElement, PropertyDeclaration } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import './percents-view'
import './evolutions-view'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import {Checkbox} from '@material/mwc-checkbox'
// import data from '../../dumps/pairs-klines.json'
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKobjects, PairName, popLastUnit, PairsKlines, getPairsNameObjectFromName } from '../pairs';
import { filterPairsKlinesFromCandidates } from '../filters';
import { fetchLocalBinancePairs, fetchLocalPairsKlines, goToCryptowatch } from './util'
import { TextField } from '@material/mwc-textfield'
import './strict-evolutions'
import './age-view'
import './volume-view'
import { VolumeView } from './volume-view'

declare global {
  interface Window {
    app: MonitoringApp;
  }
}

@customElement('monitoring-app')
export class MonitoringApp extends LitElement {
  public binancePairs: PairName[] = [];
  public rawData?: PairsKlines;
  public klines?: PairsKobjects;

  private fetchInfos!: { date: number, unit: string, width: number };

  private assets = ['USDT']
  private removeLastDay = false;

  private initialFetchPromise = Promise.resolve();
  get initialFetchComplete () {
    return this.initialFetchPromise;
  }

  @property({type: Number})
  public tabIndex = 0;

  @query('mwc-textfield[label=assets]') assetsTextField!: TextField;
  @query('volume-view') volumeView!: VolumeView;

  constructor() {
    super()
    window.app = this

    let resolve, reject
    this.initialFetchPromise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    // Fetch data
    Promise.all([
      fetchLocalPairsKlines(),
      fetchLocalBinancePairs(),
      fetch('./dumps/last-fetch-informations.json').then(res => res.json())
    ]).then(([raw, pairs, fetchInfos]) => {
      this.fetchInfos = fetchInfos
      this.rawData = raw
      this.binancePairs = pairs
      this.updateData()
      resolve(this.klines)
    })
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
          @change=${(e) => {this.removeLastDay = e.target.checked; this.updateData()}}></mwc-checkbox>
      </mwc-formfield>
    </div>

    <div style="margin: 24px 0">Last update : ${new Date(this.fetchInfos?.date || 0)} (${this.fetchInfos?.width}${this.fetchInfos?.unit})</div>

    <mwc-tab-bar style="margin: 30px 0;"
        @MDCTabBar:activated="${e => {
          this.tabIndex = e.detail.index
        }}">
      <mwc-tab label="age"></mwc-tab>
      <mwc-tab label="strict ascendings"></mwc-tab>
      <mwc-tab label="strict descendings"></mwc-tab>
      <mwc-tab label="volumes"></mwc-tab>
      <mwc-tab label="% negatif"></mwc-tab>
      <mwc-tab label="% positif"></mwc-tab>
      <mwc-tab label="chutes (scores)"></mwc-tab>
      <mwc-tab label="montées (scores)"></mwc-tab>
    </mwc-tab-bar>

    <age-view .app=${this} class="view" ?show="${this.tabIndex === 0}"></age-view>
    <strict-evolutions .app=${this} class="view" ?show="${this.tabIndex === 1}" ascending></strict-evolutions>
    <strict-evolutions .app=${this} class="view" ?show="${this.tabIndex === 2}"></strict-evolutions>
    <volume-view class="view" ?show=${this.tabIndex === 3}></volume-view>
    <percents-view class="view" ?show="${this.tabIndex === 4}" croissant></percents-view>
    <percents-view class="view" ?show="${this.tabIndex === 5}"></percents-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 6}" croissant></evolutions-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 7}"></evolutions-view>
    `
  }

  // private removeIncompleteLastDay(remove: boolean) {
  //   const target = e.target as Checkbox;
  //   setTimeout(() => {
  //     this.removeLastDay = target.checked
  //     this.updateData()
  //   }, 200)
  // }

  private onAssetsChange() {
    this.assets = this.assetsTextField.value.split(',')
    this.updateData()
    this.requestUpdate()
  }

  updateData () {
    // Converting kLines to kObjects for easier use
    this.klines = convertPairsKlinesToPairsKobjects(
      filterPairsKlinesFromCandidates(
        this.rawData!,
        getCandidatePairs(this.binancePairs, [], this.assets)
      )
    )

    if (this.removeLastDay) {
      popLastUnit(this.klines)
    }

    this.updateViews()
    // this.requestUpdate()
  }

  public updateViews() {
    this.volumeView.requestUpdate()
    this.requestUpdate()
  }

  goToCryptowatch(pair: any) {
    const {s: symbol, q: quote} = getPairsNameObjectFromName(this.binancePairs, pair)!
    goToCryptowatch(symbol, quote)
  }

  // requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown>): void {
  //   this.tabIndex === 7 && this.volumeView && this.volumeView.requestUpdate()
  //   super.requestUpdate(name, oldValue, options)
  // }

  // public getCandidates (assets: string[]) {
  //   return getCandidatePairs(this.binancePairs, [], assets)
  // }

  // public async updateBinancePairs () {
  //   this.binancePairs = await fetchBinancePairs()
  // }
}