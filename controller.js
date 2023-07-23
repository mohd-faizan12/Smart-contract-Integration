const express = require("express");
const Web3 = require("web3");
const fs = require("fs");
const Provider = require("@truffle/hdwallet-provider");
const abi = require("./abi.json");
const app = express();

const SmartContractAddress = "0x3050573F12A4E172b35EEC0A0E707666351694bD";

const address = "0x1b15125862d6D61D6387dc86948E8FC2A7cD84E2";
const privatekey =
  "ea6aa4c5a9f220c8d2a398dc4768a4607c31555e95e34fe9a3f54d1c9e62e6a0";
const rpcurl =
  "https://eth-goerli.g.alchemy.com/v2/Tq5LGjXQFkAjhxeqWr9H4LOV4d_ImwJ6";

class ContractInteraction {
  async PostGreet(req, res) {
    try {
      const data = req.body;
      const provider = new Provider(privatekey, rpcurl); //creating provider, we can declare an array of private keys
      const web3 = new Web3(provider);
      const account = await web3.eth.accounts.wallet.add(`0x${privatekey}`);
      const myContract = new web3.eth.Contract(abi, SmartContractAddress); //creating contract instances
      const oldGreet = await myContract.methods.Greeting().call();
      console.log("oldGreet", oldGreet);

      var newGreet = await myContract.methods.Greet(data).encodeABI();
      const count = await web3.eth.getTransactionCount(account.address);
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: account.address,
          nonce: web3.utils.toHex(count),
          gas: web3.utils.toHex(10000000),
          to: SmartContractAddress,
          data: newGreet,
        },
        privatekey
      );

      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );
      console.log("createReceipt", createReceipt);
      return res.status(200).json({ "Transaction is done: ": createReceipt });
    } catch (err) {
      console.log("error: ", err);

      return res.status(500).json("error: " + err);
    }
  }
  async getOldGreet(req, res) {
    try {
      const provider = new Provider(privatekey, rpcurl); //creating provider, we can declare an array of private keys
      const web3 = new Web3(provider);
      const account = await web3.eth.accounts.wallet.add(`0x${privatekey}`);
      const myContract = new web3.eth.Contract(abi, SmartContractAddress); //creating contract instances
      const oldGreet = await myContract.methods.Greeting().call();
      console.log(oldGreet);
      return res.status(200).json({ "Old Greet :": oldGreet });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ "err: ": error });
    }
  }
}

module.exports = new ContractInteraction();
