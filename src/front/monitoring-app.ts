import {css, customElement, html, LitElement, property} from 'lit-element'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import './percents-view'
import './evolutions-view'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import {Checkbox} from '@material/mwc-checkbox'
import data from '../../dumps/pairs-klines.json'
import { convertPairsKlinesToPairsKobjects, getCandidatePairs, PairsKobjects, popLastDays } from '../pairs';
import { filterPairsKlinesFromCandidates } from '../filters';

// const tabs = [ 'low percents' ]

declare global {
  interface Window {
    app: MonitoringApp;
  }
}

@customElement('monitoring-app')
export class MonitoringApp extends LitElement {
  private assets = ['USDT', 'EUR']
  private removeLastDays = false;

  @property({type: Number})
  public tabIndex = 0;

  public data!: PairsKobjects;

  constructor() {
    super()


    this.updateData()
    window.app = this;
  }

  static styles = css`
  :host {
    display: block;
    max-width: 800px;
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
    <mwc-textfield label="assets" value="${this.assets.join(',')}"
      @change="${e => this.onAssetsChange(e)}"></mwc-textfield>
    <mwc-formfield label="remove incomplete current day">
      <mwc-checkbox
        @click="${(e) => this.onRemoveIncompleteLastDays(e)}"></mwc-checkbox>
    </mwc-formfield>
    <mwc-tab-bar style="margin: 30px 0;"
        @MDCTabBar:activated="${e => {
          this.tabIndex = e.detail.index
        }}">
      <mwc-tab label="% negatif"></mwc-tab>
      <mwc-tab label="% positif"></mwc-tab>
      <mwc-tab label="chutes (scores)"></mwc-tab>
      <mwc-tab label="montées (scores)"></mwc-tab>
    </mwc-tab-bar>

    <percents-view class="view" ?show="${this.tabIndex === 0}" croissant></percents-view>
    <percents-view class="view" ?show="${this.tabIndex === 1}"></percents-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 2}" croissant></evolutions-view>
    <evolutions-view class="view" ?show="${this.tabIndex === 3}"></evolutions-view>
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

  private onAssetsChange(e) {
    this.assets = e.target.value.split(',')
    this.updateData()
    this.requestUpdate()
  }

  private updateData () {
    const candidates = getCandidatePairs(this.assets, this.assets)
    this.data = convertPairsKlinesToPairsKobjects(
      // @ts-ignore
      filterPairsKlinesFromCandidates(data, candidates)
    )
    if (this.removeLastDays) {
      popLastDays(this.data)
    }
  }
}