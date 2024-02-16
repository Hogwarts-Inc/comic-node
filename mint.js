const express = require('express');
require('dotenv').config();
const { ethers } = require("ethers");
const fs = require('fs');

const app = express();
app.use(express.json());

const { PORT, QUICKNODE_HTTP_ENDPOINT, PRIVATE_KEY } = process.env;
const port = PORT;

const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT);
const privateKey = PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider).connect(provider); // Connect wallet to provider

const contractAddress = "0x537FfcB7c76e57f0be54D2fcc79568dAA44E998c";
const contractAbi = JSON.parse(fs.readFileSync("abi.json").toString()); // Ensure this file exists and is correct
const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider);


async function getGasPrice() {
  let feeData = await provider.getGasPrice();
  return feeData;
}

async function mintNFT(address, URI) {
  try {
    const gasFee = await getGasPrice();
    const contractWithSigner = contractInstance.connect(wallet);
    const txn = await contractWithSigner.mintNFT(address, URI, { gasPrice: gasFee });

    console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"));
    let receipt = await txn.wait();
    if (receipt) {
      console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", txn.hash + '\n' + "Block Number: " + receipt.blockNumber + '\n' + "Navigate to https://polygonscan.com/tx/" + txn.hash, "to see your transaction");
      return txn.hash; // Return the transaction hash
    } else {
      console.log("Error submitting transaction");
      return null;
    }
  } catch (e) {
    console.log("Error Caught in Catch Statement: ", e);
    throw e; // Rethrow the error to be handled by the caller
  }
}

app.post('/mint', async (req, res) => {
  const { address, URI } = req.body;
  if (!address || !URI) {
    return res.status(400).send('Address and URI are required.');
  }
  try {
    const txnHash = await mintNFT(address, URI);
    if (txnHash) {
      res.send({ message: 'NFT minting transaction submitted.', txnHash: txnHash });
    } else {
      res.status(500).send('Error minting NFT, but no details provided.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error minting NFT.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`NFT minting service running at http://localhost:${port}`);
});
