const { Web3 } = require("web3");
const Provider = require("@truffle/hdwallet-provider");

const abi = require("./abi.json");

const providerUrl = "https://api.avax-test.network/ext/bc/C/rpc"; // Mainnet provider URL

// Contract addresses and ABI for testnet USDT (Tether) token
// const usdtAddress = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"; // Testnet USDT token address
const usdtAddress = "0x00E67d12Dc11FFCdb807e57899c7B4B83e04fa84"; // Testnet USDT token address

// Your wallet private key
const senderPrivateKey =
  "f3bd7440ecc156f71d17be74813efa82057b57d2786fee8e4005baeccd6f5c20";
const senderAddress = "0x4EF6B65d557Fe88DC86eAF96E830d9A4e2fCaBfB"; // Replace with the sender's address
const recipientAddress = "0xe4860f8f2342F0fe3D0d30A0A3211EA8248a8254"; // Replace with the recipient's address
const amount = 1000000; // Replace with the amount of USDT to transfer

// Transfer USDT function
async function transferUSDT() {
  try {
    // Load the USDT contract
    const provider = new Provider(senderPrivateKey, providerUrl);
    const web3 = new Web3(provider);
    const usdtContract = new web3.eth.Contract(abi, usdtAddress);
    const name = await usdtContract.methods.totalSupply().call();
    console.log("name :", name.toString());

    const transferData = usdtContract.methods
      .transfer(recipientAddress, amount)
      .encodeABI();
    const nonce = await web3.eth.getTransactionCount(senderAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = "210"; // Replace with the desired gas limit for the transaction

    const txParams = {
      from: senderAddress,
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: usdtAddress,
      data: transferData,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      txParams,
      senderPrivateKey
    );
    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(
      "Transaction successful Transaction hash:",
      txReceipt.transactionHash
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Call the transferUSDT function
transferUSDT();
