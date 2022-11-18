const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const seniorSupplierContract = require("../../artifacts/contracts/SeniorSupplierProcess.sol/SeniorSupplierProcess.json");
const question = require("./cli_questions");

const FEEDBACK_FUNC = process.env.FEEDBACK_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const SENIOR_SUPPLIER_CONTRACT_ADDRESS = process.env.SENIOR_SUPPLIER_CONTRACT_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

async function queueSeniorFeedback() {
    // User's Input data
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    const feedback_name = await question.feedback_name_request();
    const proposal_description = await question.proposal_description_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
    const seniorSupplierProcessContract = new ethers.Contract(SENIOR_SUPPLIER_CONTRACT_ADDRESS, seniorSupplierContract.abi, signer);

    const encodedFunctionCall = seniorSupplierProcessContract.interface.encodeFunctionData(FEEDBACK_FUNC, [feedback_name]);
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