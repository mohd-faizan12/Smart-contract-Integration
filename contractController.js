// To Use env file Variables
require("dotenv").config();
const logger = require("./services/logger");
const Web3 = require("web3");

// Artifact of uniblokContract smart contract
const compileData = require("./artifacts/contracts/UniblokContract.sol/UniblokContract.json");

class uniblokContracts {
  /**
     * @desc deploy smart contract on pando blockchain
    
     * @returns {address} contract address
     */
  async deployContract(req, res, next) {
    try {
      const {
        jobTitle,
        clientName,
        serviceProvider,
        estimatedBudget,
        estimatedHours,
        estimatedWeek,
        estimatedTeamSize,
        netSettlement,
        uniblokServiceFee,
        expectedAmountToBeReceived,
        finalAmount,
        jobCategory,
        OfferDate,
        offerExpires,
        expectedCompletionOn,
      } = req.body;
      const web3 = await new Web3(process.env.rpcURL);
      const account = await web3.eth.accounts.wallet.add(
        `0x${process.env.PRIVATE_KEY}`
      );
      let abi = compileData.abi;
      let contractBytecode = compileData.bytecode;
      const result = await new web3.eth.Contract(abi)
        .deploy({
          data: contractBytecode,
          arguments: [
            [jobTitle, clientName, serviceProvider],
            [
              estimatedBudget,
              estimatedHours,
              estimatedWeek,
              estimatedTeamSize,
              netSettlement,
            ],
            [uniblokServiceFee, expectedAmountToBeReceived, finalAmount],
            [jobCategory, OfferDate, offerExpires, expectedCompletionOn],
          ],
        })
        .send({ from: account.address, gas: 2000000 });
      logger.info(`200 : Contract deployed to : ${result.options.address}`);
      res.status(200).json({
        "contract is deployed to the address: ": result.options.address,
      });
      console.log(
        "Contract is finally deployed and the address is",
        result.options.address
      );
    } catch (error) {
      console.log("err", error);
      logger.error(`500: error: ${error.message}`);
      return res.status(500).json({ Error: "Internal Server Error" + error });
    }
  }
}
module.exports = new uniblokContracts();
