const { ethers } = require("hardhat");
const BOARD_NAMES = ["Board Member 1","Board Member 2","Board Member 3","Board Member 4","Board Member 5"];
const PUBLIC_BOARD = [process.env.BOARD_MEMBER_1, process.env.BOARD_MEMBER_2, process.env.BOARD_MEMBER_3, process.env.BOARD_MEMBER_4, process.env.BOARD_MEMBER_5];

async function deployAdministrativeAccessControl() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const AdministrativeAccessControl = await ethers.getContractFactory("AdministrativeAccessControl");
    const administrativeAccessControl = await AdministrativeAccessControl.deploy(BOARD_NAMES, PUBLIC_BOARD);

    console.log("Administrative Access Control Contract address: ", administrativeAccessControl.address);

};

deployAdministrativeAccessControl()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

