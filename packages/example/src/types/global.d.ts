/// <reference types="@keplr-wallet/types" />

declare global {
  interface Window {
    keplr?: import('@keplr-wallet/types').Keplr;
  }
}

export {};
