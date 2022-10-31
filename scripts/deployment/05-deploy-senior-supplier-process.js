const { ethers } = require("hardhat");

async function deployAdministrativeRecruitmentProcess() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const SeniorSupplierProcess = await ethers.getContractFactory("SeniorSupplierProcess");
    const seniorSupplierProcess = await SeniorSupplierProcess.deploy();

    console.log("Senior Supplier Process Contract address: ", seniorSupplierProcess.address);

};

deployAdministrativeRecruitmentProcess()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });