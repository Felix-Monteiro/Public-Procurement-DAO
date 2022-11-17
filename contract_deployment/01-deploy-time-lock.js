const { ethers } = require("hardhat");
const MIN_DELAY = process.env.MIN_DELAY;

async function deployTimeLock() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const TimeLock = await ethers.getContractFactory("TimeLock");
    const timeLock = await TimeLock.deploy(MIN_DELAY, [], [])

    console.log("TimeLock Contract address: ", timeLock.address);
}

deployTimeLock()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

