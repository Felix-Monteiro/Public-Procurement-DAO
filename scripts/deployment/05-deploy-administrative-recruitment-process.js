const { ethers } = require("hardhat");

async function deployAdministrativeRecruitmentProcess() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const AdministrativeRecruitmentProcess = await ethers.getContractFactory("AdministrativeRecruitmentProcess");
    const administrativeRecruitmentProcess = await AdministrativeRecruitmentProcess.deploy();

    console.log("Administrative Recruitment Process Contract address: ", administrativeRecruitmentProcess.address);

};

deployAdministrativeRecruitmentProcess()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
