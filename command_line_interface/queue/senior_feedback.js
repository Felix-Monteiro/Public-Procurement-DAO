const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const seniorSupplierContract = require("../../artifacts/contracts/SeniorSupplierProcess.sol/SeniorSupplierProcess.json");

const FEEDBACK_FUNC = process.env.FEEDBACK_FUNC;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const SENIOR_SUPPLIER_CONTRACT_ADDRESS = process.env.SENIOR_SUPPLIER_CONTRACT_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
const seniorSupplierProcessContract = new ethers.Contract(SENIOR_SUPPLIER_CONTRACT_ADDRESS, seniorSupplierContract.abi, signer);


async function queueSeniorFeedback() {
    // User's Input data
    const proposalId = "";
    const feedback_name = "Centro Ortopedico da Parede"
    const proposal_description = "I Propose that Senior Suppliers get extra payment in comparison with new Suppliers!";
    
    const functionToCall = FEEDBACK_FUNC;
    const encodedFunctionCall = seniorSupplierProcessContract.interface.encodeFunctionData(functionToCall, [feedback_name]);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Queueing...")
    const queueTx = await governanceProtocolContract.queue(
        [seniorSupplierProcessContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash);

    await queueTx.wait();
    console.log(`Thank you for Queueing Proposal: ${proposalId}\n`);
    console.log(`Please wait the required minimum delay: ${MIN_DELAY} before executing.\n`);
};

queueSeniorFeedback()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });