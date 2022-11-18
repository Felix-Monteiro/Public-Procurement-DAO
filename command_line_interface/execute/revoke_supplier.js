const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminAccessControlContract = require("../../artifacts/contracts/board_administration/AdministrativeAccessControl.sol/AdministrativeAccessControl.json");
var fs = require('fs');
const question = require("./cli_questions");

const executedProposals = process.env.executedProposals;
const SUPPLIER_RMV_FUNC = process.env.SUPPLIER_RMV_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMIN_AC_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_ACCESS_CONTROL_ADDRESS;

async function executeRevokeSupplierMember() {
    // User's Input data
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    const supplier_id = await question.supplier_id_request();
    const supplier_address = await question.supplier_address_request();
    const proposal_description = await question.proposal_description_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
    const administrativeAccessControlContract = new ethers.Contract(ADMIN_AC_CONTRACT_ADDRESS, adminAccessControlContract.abi, signer);

    const encodedFunctionCall = administrativeAccessControlContract.interface.encodeFunctionData(SUPPLIER_RMV_FUNC, [supplier_id, supplier_address])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Executing...");
    const executeTx = await governanceProtocolContract.execute(
        [administrativeAccessControlContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait();

    // Save Executed Proposal in JSON file
    let proposalsInfo = JSON.parse(fs.readFileSync(executedProposals, "utf8"));
    proposalsInfo["goerli"].push("ID: " + proposalId.toString(),
        ["Index: " + proposalId.toString(), "Function: " + SUPPLIER_RMV_FUNC.toString(), "Passed"]);
    fs.writeFileSync(executedProposals, JSON.stringify(proposalsInfo, null, 2));

    console.log(`Thank you for Executing Proposal: ${proposalId}\n`);
    console.log(`Supplier Member Role verification = ${await administrativeAccessControlContract.verifySupplier(supplier_address)}`);
};

executeRevokeSupplierMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });