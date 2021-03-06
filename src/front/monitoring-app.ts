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
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKobjects, PairName, popLastUnit, PairsKlines } from '../pairs';
import { filterPairsKlinesFromCandidates } from '../filters';
import { fetchLocalBinancePairs, fetchLocalPairsKlines } from './util'
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
  public kObjects?: PairsKobjects;

  private fetchInfos!: { date: number, unit: string, width: number };

  private assets = ['USDT']
  private removeLastDay = false;

  @property({type: Number})
  public tabIndex = 0;


  @query('mwc-textfield[label=assets]') assetsTextField!: TextField;
  @query('volume-view') volumeView!: VolumeView;

  constructor() {
    super()
    window.app = this

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
      <mwc-tab label="% negatif"></mwc-tab>
      <mwc-tab label="% positif"></mwc-tab>
      <mwc-tab label="chutes (scores)"></mwc-tab>
      <mwc-tab label="mont??es (scores)"></mwc-tab>
      <mwc-tab label="strict ascendings"></mwc-tab>
      <mwc-tab label="strict descendings"></mwc-tab>
      <mwc-tab label="age"></mwc-tab>
      <mwc-tab label="volumes"></mwc-tab>
    </mwc-tab-bar>

    <percents-view class="view" ?show="${this.tabIndex === 0}" croissant></percents-view>
    <percents-view class="view" ?show="${this.tabIndex === 1}"></percents-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 2}" croissant></evolutions-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 3}"></evolutions-view>
    <strict-evolutions class="view" ?show="${this.tabIndex === 4}" ascending></strict-evolutions>
    <strict-evolutions class="view" ?show="${this.tabIndex === 5}"></strict-evolutions>
    <age-view class="view" ?show="${this.tabIndex === 6}"></age-view>
    <volume-view class="view" ?show=${this.tabIndex === 7}></volume-view>
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

  public updateData () {
    // Converting kLines to kObjects for easier use
    this.kObjects = convertPairsKlinesToPairsKobjects(
      filterPairsKlinesFromCandidates(
        this.rawData!,
        getCandidatePairs(this.binancePairs, [], this.assets)
      )
    )

    if (this.removeLastDay) {
      popLastUnit(this.kObjects)
    }

    this.updateViews()
    // this.requestUpdate()
  }

  public updateViews() {
    this.volumeView.requestUpdate()
    this.requestUpdate()
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