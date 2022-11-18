var fs = require('fs');
const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const supplierContract = require("../../artifacts/contracts/SupplierProcess.sol/SupplierProcess.json");
const question = require("./cli_questions");

const executedProposals = process.env.executedProposals;
const SERVICE_FUNC = process.env.SERVICE_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const SUPPLIER_CONTRACT_ADDRESS = process.env.SUPPLIER_CONTRACT_ADDRESS;

async function executeSupplierService() {
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
    const supplierProcessContract = new ethers.Contract(SUPPLIER_CONTRACT_ADDRESS, supplierContract.abi, signer);

    const encodedFunctionCall = supplierProcessContract.interface.encodeFunctionData(SERVICE_FUNC, [supplier_name, supplier_address])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Executing...");
    const executeTx = await governanceProtocolContract.execute(
        [supplierProcessContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait();

    // Save Executed Proposal in JSON file
    let proposalsInfo = JSON.parse(fs.readFileSync(executedProposals, "utf8"));
    proposalsInfo["goerli"].push("ID: " + proposalId.toString(),
        ["Index: " + proposalId.toString(), "Function: " + SERVICE_FUNC.toString(), "Passed"]);
    fs.writeFileSync(executedProposals, JSON.stringify(proposalsInfo, null, 2));

    console.log(`Thank you for Executing Proposal: ${proposalId}\n`);
    console.log(`Senior Supplier State: ${await supplierProcessContract.verifySeniorSupplier(supplier_address)}`);
    console.log(`Suppliers: ${await supplierProcessContract.retrieveSuppliers()}`);
};

executeSupplierService()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });