# Agoric React Components Example

This is a complete example application built with Vite that demonstrates how to integrate and use the `@agoric/react-components` package. It showcases wallet connection, smart wallet provisioning, and purse management functionality.

## Overview

This example app provides a practical implementation of:

- **Wallet Connection**: Connecting to Keplr wallet and managing offline signers
- **Smart Wallet Provisioning**: Handling smart wallet setup and fees
- **Purse Management**: Displaying and managing different asset purses
- **Agoric Integration**: Using the Agoric React Components ecosystem

## Prerequisites

- Node.js (v20 or higher)
- Yarn package manager
- Keplr wallet browser extension
- Access to Agoric devnet

## Getting Started

### 1. Install Dependencies

From the root of the ui-kit repository:

```bash
yarn install
```

### 2. Build Dependencies

From the root of the ui-kit repository:

```bash
yarn prepack
```

### 3. Run the Example

```bash
cd packages/example
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
yarn build
yarn preview
```

## Key Features

### Wallet Connection

- **Automatic Connection**: The app automatically attempts to connect to Keplr on load
- **Manual Connection**: Users can manually connect via the "Connect Keplr" button
- **Type Safety**: Uses `@keplr-wallet/types` for proper TypeScript support

### Smart Wallet Provisioning

- **Provision Status**: Displays whether the user's smart wallet is provisioned
- **Fee Display**: Shows the BLD fee required for provisioning
- **Faucet Link**: Provides a link to the Agoric devnet faucet for getting BLD
- **One-Click Provisioning**: Allows users to provision their smart wallet with a single click

### Purse Management

- **Asset Display**: Shows all available purses with their balances
- **Amount Formatting**: Properly formats amounts using the asset's decimal places
- **Real-time Updates**: Purses update automatically as the wallet state changes

## Code Structure

### Key Files

- **`src/App.tsx`**: Main application component with AgoricProvider setup
- **`src/hooks/useWalletManager.ts`**: Custom hook for wallet connection logic
- **`src/components/WalletDetails.tsx`**: Component displaying wallet information and controls
- **`src/utils/constants.ts`**: Network configuration and constants
- **`src/types/global.d.ts`**: TypeScript declarations for Keplr wallet

### Key Components

#### AgoricProvider Setup

```tsx
<AgoricProvider
  restEndpoint={REST_ENDPOINT}
  rpcEndpoint={RPC_ENDPOINT}
  offlineSigner={offlineSigner}
  address={address}
  chainName={CHAIN_ID}
>
  {/* Your app components */}
</AgoricProvider>
```

#### Wallet Connection Hook

```tsx
const { address, connectWallet, offlineSigner } = useWalletManager();
```

#### Agoric Context Usage

```tsx
const {
  isSmartWalletProvisioned,
  purses,
  address,
  provisionSmartWallet,
  smartWalletProvisionFee,
} = useAgoric();
```

## Configuration

### Network Settings

The app is configured for Agoric devnet by default. Key settings in `src/utils/constants.ts`:

- **Chain ID**: `agoricdev-25`
- **RPC Endpoint**: `https://devnet.rpc.agoric.net:443`
- **REST Endpoint**: `https://devnet.api.agoric.net`
- **Network Config**: `https://devnet.agoric.net/network-config`

### Vite Configuration

The app includes Node.js polyfills for browser compatibility:

- Buffer polyfill for crypto operations
- Process polyfill for development
- Proper handling of Node.js modules in the browser

## Development

### Available Scripts

- **`yarn dev`**: Start development server with hot reload
- **`yarn build`**: Build for production
- **`yarn preview`**: Preview production build
- **`yarn lint`**: Run ESLint

### TypeScript Support

The example includes comprehensive TypeScript support:

- Keplr wallet types via `@keplr-wallet/types`
- Global type declarations for `window.keplr`
- Proper typing for all Agoric components and hooks

## Troubleshooting

### Common Issues

1. **"Buffer is not defined"**: Ensure Node.js polyfills are properly configured in Vite
2. **"Please install Keplr extension"**: Install the Keplr wallet browser extension
3. **Connection failures**: Check that you're on the correct network (Agoric devnet)
4. **Build errors**: Ensure all dependencies are built (`yarn build` in react-components)

### Getting BLD for Testing

Use the Agoric devnet faucet: https://devnet.faucet.agoric.net/

## Learn More

- [Agoric React Components Documentation](../react-components/README.md)
- [Agoric Web Components](../web-components/README.md)
- [Agoric RPC Package](../rpc/README.md)
- [Agoric Documentation](https://docs.agoric.com/)

## Contributing

This example serves as a reference implementation. When making changes:

1. Ensure the example still works end-to-end
2. Update this README if functionality changes
3. Test both development and production builds
4. Verify TypeScript compilation passes
