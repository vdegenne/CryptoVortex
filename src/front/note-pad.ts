import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js'

import '@material/mwc-dialog'
import {Dialog} from '@material/mwc-dialog'
import '@material/mwc-textarea'
import {TextArea} from '@material/mwc-textarea'
import { buildCryptoWatchUrl, goToCryptowatch } from './util.js';

const localName = 'cryptovortex:note'

@customElement('note-pad')
export class NotePad extends LitElement {
  @state()
  locked = true

  @state()
  content = ''

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textarea') textarea!: TextArea;

  constructor () {
    super()
    this.loadContent()
  }

  loadContent () {
    const local = localStorage.getItem(localName)
    if (local) {
      this.content = local;
    }
  }

  static styles = css`
  [hide] {
    display: none;
  }
  `

  render () {
    return html`
    <mwc-dialog heading=Note open style="--mdc-dialog-min-width:calc(100vw - 24px)">
      <mwc-textarea style="width:100%" outlined rows=24 ?hide=${this.locked}
        value=${this.content}
        @keydown=${this.onKeyDown}
        ?disabled=${this.locked}
      ></mwc-textarea>

      <p ?hide=${!this.locked} style="white-space: pre">${this.unsafeHTML(this.content)}</p>

      <mwc-icon-button icon=${this.locked?'lock':'lock_open'} slot="secondaryAction"
        @click=${()=>{this.locked=!this.locked}}></mwc-icon-button>
      <mwc-button outlined slot="primaryAction">close</mwc-button>
    </mwc-dialog>
    `
  }

  unsafeHTML (content: string) {
    return unsafeHTML(content.replaceAll(/(#[^\s]+)/g, (a) => {
      return `<a href="${buildCryptoWatchUrl(a.slice(1))}" target="_blank">${a}</a>`
    }))
  }

  onKeyDown () {
    this.content = this.textarea.value
    this.save()
  }

  save() {
    localStorage.setItem(localName, this.textarea.value)
  }

  show() {
    this.dialog.show()
  }
}