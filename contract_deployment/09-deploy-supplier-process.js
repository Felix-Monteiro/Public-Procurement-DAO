const { ethers } = require("hardhat");

async function deploySupplierProcess() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const SupplierProcess = await ethers.getContractFactory("SupplierProcess");
    const supplierProcess = await SupplierProcess.deploy();

    console.log("Supplier Process Contract address: ", supplierProcess.address);

};

deploySupplierProcess()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });