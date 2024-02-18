const express = require('express');
require('dotenv').config();
const { ethers } = require("ethers");
const fs = require('fs');

const app = express();
app.use(express.json());

const { PORT, QUICKNODE_HTTP_ENDPOINT, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
const port = PORT;

const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT);
const privateKey = PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider).connect(provider); 

const contractAddress = CONTRACT_ADDRESS;
const contractAbi = JSON.parse(fs.readFileSync("abi.json").toString()); 
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

      console.log("...Submitting mint transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"));
      let receipt = await txn.wait();
      let tokenID = receipt.events[0].args.tokenId.toString();

      if (tokenID) {
        console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", txn.hash + '\n' + "Token ID:", tokenID + '\n' + "Navigate to https://mumbai.polygonscan.com/tx/" + txn.hash, "to see your transaction");
        return { txn_hash: txn.hash, token_id: tokenID }; 
      } else {
        console.log("Error submitting transaction");
        return null;
      }
    } catch (e) {
        console.log("Error Caught in Catch Statement: ", e);
        throw e;
    }
}

async function transferNFT(fromAddress, toAddress, tokenId) {
  try {
      const gasFee = await getGasPrice();
      const contractWithSigner = contractInstance.connect(wallet);

      const txn = await contractWithSigner.transferFrom(fromAddress, toAddress, tokenId, { gasPrice: gasFee });

      console.log("...Submitting transfer transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"));
      let receipt = await txn.wait();

      console.log("Transfer is successful!!!" + '\n' + "Transaction Hash:", txn.hash + '\n' + "Navigate to https://mumbai.polygonscan.com/tx/" + txn.hash, "to see your transaction");
      return { txn_hash: txn.hash }; 
    } catch (e) {
      console.log("Error Caught in Catch Statement: ", e);
      throw e;
    }
}

app.post('/mint', async (req, res) => {
  const { address, URI } = req.body;
  if (!address || !URI) {
    return res.status(400).send('Address and URI are required.');
  }
  try {
    const mintResult = await mintNFT(address, URI);
    if (mintResult) {
      res.send({ message: 'NFT minting transaction submitted.', ...mintResult });
    } else {
      res.status(500).send('Error minting NFT, but no details provided.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error minting NFT.', details: error.message });
  }
});

app.post('/transfer', async (req, res) => {
  const { fromAddress, toAddress, tokenId } = req.body;
  if (!fromAddress || !toAddress || !tokenId) {
    return res.status(400).send('From address, to address, and token ID are required.');
  }
  try {
    const transferResult = await transferNFT(fromAddress, toAddress, tokenId);
    if (transferResult) {
      res.send({ message: 'NFT transfer transaction submitted.', ...transferResult });
    } else {
      res.status(500).send('Error transferring NFT, but no details provided.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error transferring NFT.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`NFT minting service running at http://localhost:${port}`);
});
