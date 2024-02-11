const ethers = require('ethers');
const fs = require('fs');

async function main() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('provided_URL');

    const privateKey = process.env.MY_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);

    const refundFactory = await ethers.getContractFactory("refundByLocation");

    const refundContract = await refundFactory.deploy();
    await refundContract.deployed();

    console.log("Contract deployed to address:", refundContract.address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

