
# NFT Minting Service

This project provides a simple Express-based web service for minting NFTs on the Ethereum blockchain. It utilizes the [ethers.js](https://github.com/ethers-io/ethers.js/) library to interact with the Ethereum network, allowing users to mint NFTs by sending a POST request to the service.

## Features

- Mint NFTs to a specified address with a provided URI.
- Connects to the Ethereum blockchain via a QuickNode HTTP endpoint.
- Utilizes ethers.js for blockchain interactions.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or higher recommended).
- An Ethereum wallet private key.
- Access to an Ethereum node (via services like Infura or QuickNode).

## Installation

To install the NFT Minting Service, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Hogwarts-Inc/comic-node
   ```
2. Navigate to the project directory:
   ```bash
   cd comic-node
   ```
3. Install the required npm packages:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of your project.
2. Add the following environment variables:
   ```env
   PORT=4000
   QUICKNODE_HTTP_ENDPOINT=<Your_QuickNode_HTTP_Endpoint>
   PRIVATE_KEY=<Your_Ethereum_Wallet_Private_Key>
   ```
   Replace `<Your_QuickNode_HTTP_Endpoint>` and `<Your_Ethereum_Wallet_Private_Key>` with your actual QuickNode HTTP endpoint and Ethereum wallet private key.

## Usage

To start the service, run:

```bash
npm start
```

This will launch the server on the port specified in your `.env` file (default is 4000).

### Minting an NFT

To mint an NFT, send a POST request to `/mint` with the following JSON payload:

```json
{
  "address": "<Recipient_Address>",
  "URI": "<Token_URI>"
}
```

Replace `<Recipient_Address>` with the Ethereum address to receive the NFT, and `<Token_URI>` with the URI pointing to the NFT metadata.

Example using `curl`:

```bash
curl -X POST http://localhost:4000/mint -H "Content-Type: application/json" -d '{"address": "0x...", "URI": "ipfs://..."}'
```

## Contributing

Contributions to the NFT Minting Service are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
