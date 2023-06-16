// @ts-check
import { html, LitElement } from 'lit';
import { assert, details as X } from '@agoric/assert';

// This site tells the component the URL to load the wallet bridge from. For
// development, the form on this site can be changed to point the dapp to a
// different wallet URL. It defaults to 'https://wallet.agoric.app'.
const DEFAULT_LOCATOR_HREF =
  'https://wallet.agoric.app/locator/?append=/wallet/bridge.html';

export const BridgeProtocol = /** @type {const} */ ({
  prefix: 'agoric_',
  error: 'agoric_bridgeError',
  loaded: 'agoric_walletBridgeLoaded',
  requestDappConnection: 'agoric_requestDappConnection',
  checkIfDappApproved: 'agoric_checkIfDappApproved',
  dappApprovalChanged: 'agoric_dappApprovalChanged',
  addOffer: 'agoric_addOffer',
});

/**
 * @typedef {{
 * instanceHandle: import('@endo/marshal').CapData<"Instance">;
 * publicInvitationMaker: string;
 * proposalTemplate: unknown
 * }} OfferConfig
 */

/**
 * Web component for connecting to the Agoric Smart Wallet bridge. Mainly used
 * for sending offers to a trusted wallet UI to be inspected and signed.
 */
export class DappWalletBridge extends LitElement {
  static get properties() {
    return {
      address: { type: String },
      chainId: { type: String },
      locatorHref: { type: String },
      bridgeHref: { type: String },
    };
  }

  constructor() {
    super();
    this.locatorHref = DEFAULT_LOCATOR_HREF;
    this.bridgeHref = null;
    this.isBridgeReady = false;
    this.sendMessageToBridge = null;
    this.chainId = null;
    this.address = null;
  }

  /**
   * Propogates any errors from the iframe up to the dapp in a message.
   *
   * @param {any} e
   */
  onError(e) {
    const ev = new CustomEvent('error', {
      detail: {
        e,
      },
    });
    this.dispatchEvent(ev);
  }

  /**
   * When the locator site tells us the url of the wallet bridge, set
   * `bridgeHref` so we can load the bridge in an iframe.
   *
   * @param {{ detail: any; }} ev
   */
  onLocateMessage(ev) {
    console.debug('located wallet bridge', ev);
    const { data } = ev.detail;
    try {
      assert.typeof(data, 'string', X`Expected locate message to be a string`);
    } catch (e) {
      this.onError(e);
    }

    this.bridgeHref = data;
    this.requestUpdate();
    const dappEvent = new CustomEvent('bridgeLocated', {
      detail: {
        bridgeLocation: data,
      },
    });
    this.dispatchEvent(dappEvent);
  }

  /**
   * Signals to the dapp that the bridge is ready. Provides a few actions
   * and a flag indicating whether the dapp is approved in the wallet UI.
   *
   * @param {{ isDappApproved: boolean }} data
   */
  dispatchBridgeLoadedMessage(data) {
    const ev = new CustomEvent('bridgeReady', {
      detail: {
        addOffer: (/** @type {OfferConfig} */ offerConfig) =>
          this.sendMessageToBridge({
            type: BridgeProtocol.addOffer,
            offerConfig,
          }),
        requestDappConnection: (/** @type {string} */ petname) =>
          this.sendMessageToBridge({
            type: BridgeProtocol.requestDappConnection,
            petname,
          }),
        isDappApproved: data.isDappApproved,
      },
    });
    this.dispatchEvent(ev);
  }

  /**
   * When the bridge is first loaded, it signals `walletBridgeLoaded` and
   * provides a `send` function for sending messages to it. The first thing
   * the dapp should do is check if it needs approval.
   *
   * @param {{ detail: any; }} ev
   */
  onBridgeReadyMessage(ev) {
    const { data, send } = ev.detail;
    try {
      assert.equal(
        data.type,
        BridgeProtocol.loaded,
        X`Unexpected bridge message type ${data.type}, expected ${BridgeProtocol.loaded}`,
      );
      assert.string(
        this.address,
        X`Bridge requires an address to connect to the agoric wallet.`,
      );
      assert.string(
        this.chainId,
        X`Bridge requires a chainId to connect to the agoric wallet.`,
      );
    } catch (e) {
      this.onError(e);
    }
    send({
      type: BridgeProtocol.checkIfDappApproved,
      address: this.address,
      chainId: this.chainId,
    });
    this.sendMessageToBridge = send;
  }

  /**
   * After we've checked if the dapp needs approval, signal to the rest of the
   * dapp that the bridge is ready to use.
   *
   * @param {{ detail: any; }} ev
   */
  onCheckIfDappApprovedMessage(ev) {
    const { data } = ev.detail;
    this.dispatchBridgeLoadedMessage(data);
  }

  dispatchBridgeMessage(ev) {
    const bridgeMessage = new CustomEvent('bridgeMessage', {
      detail: ev.detail,
    });
    this.dispatchEvent(bridgeMessage);
  }

  /**
   * Handle messages from the wallet bridge.
   *
   * @param {{ detail: any; }} ev
   */
  onBridgeMessage(ev) {
    console.debug('bridge message received', ev);
    if (ev.detail.data.type === BridgeProtocol.error) {
      this.onError(Error(ev.detail.data.message));
      return;
    }

    if (!this.isBridgeReady) {
      this.onBridgeReadyMessage(ev);
      this.isBridgeReady = true;
      return;
    }

    switch (ev.detail.data.type) {
      case BridgeProtocol.checkIfDappApproved:
        this.onCheckIfDappApprovedMessage(ev);
        break;
      default:
        this.dispatchBridgeMessage(ev);
        break;
    }
  }

  render() {
    // Locate the bridge first.
    if (this.bridgeHref === null) {
      return html`<agoric-iframe-messenger
        src=${this.locatorHref}
        @message=${this.onLocateMessage}
        @error=${this.onError}
      >
      </agoric-iframe-messenger>`;
    }

    return html`<agoric-iframe-messenger
      src=${this.bridgeHref}
      @message=${this.onBridgeMessage}
      @error=${this.onError}
    ></agoric-iframe-messenger>`;
  }
}
