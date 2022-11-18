const { ethers } = require("hardhat");
const question = require("../proposals/cli_questions");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminAccessControlContract = require("../../artifacts/contracts/board_administration/AdministrativeAccessControl.sol/AdministrativeAccessControl.json");

const SUPPLIER_FUNC = process.env.SUPPLIER_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMIN_AC_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_ACCESS_CONTROL_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

async function queueSupplierMember() {
    // User's Input data
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    const supplier_name = await question.supplier_name_request();
    const supplier_address = await question.supplier_address_request();
    const proposal_description = await question.proposal_description_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
    const administrativeAccessControlContract = new ethers.Contract(ADMIN_AC_CONTRACT_ADDRESS, adminAccessControlContract.abi, signer);

    const encodedFunctionCall = administrativeAccessControlContract.interface.encodeFunctionData(SUPPLIER_FUNC, [supplier_name, supplier_address])
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

queueSupplierMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });