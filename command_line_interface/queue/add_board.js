const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminAccessControlContract = require("../../artifacts/contracts/board_administration/AdministrativeAccessControl.sol/AdministrativeAccessControl.json");

const BOARD_MEMBER_FUNC = process.env.BOARD_MEMBER_FUNC;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMIN_AC_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_ACCESS_CONTROL_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
const administrativeAccessControlContract = new ethers.Contract(ADMIN_AC_CONTRACT_ADDRESS, adminAccessControlContract.abi, signer);

async function queueBoardMember() {

    // User's Input data
    const proposalId = "87682373069479461525533303711234253007537672939961937872977076452708494334166";
    const board_member_name = "Dr. Jose Felix";
    const board_member_address = process.env.BOARD_MEMBER_NEW;
    const proposal_description = "This is a good Board Member for our company";
    const functionToCall = BOARD_MEMBER_FUNC;

    const encodedFunctionCall = administrativeAccessControlContract.interface.encodeFunctionData(functionToCall, [board_member_name, board_member_address])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Queueing...")
    const queueTx = await governanceProtocolContract.queue(
        [administrativeAccessControlContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash);

    await queueTx.wait();
    console.log(`Thank you for Queueing Proposal: ${proposalId}\n`);
    console.log(`Please wait the required minimum delay: ${MIN_DELAY} before executing.\n`);
};

queueBoardMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });