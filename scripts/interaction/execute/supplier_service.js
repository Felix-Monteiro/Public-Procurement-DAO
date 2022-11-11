const { ethers } = require("hardhat");
const governanceContract = require("../../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const supplierContract = require("../../../artifacts/contracts/SupplierProcess.sol/SupplierProcess.json");
var fs = require('fs');

const executedProposals = process.env.executedProposals;
const SERVICE_FUNC = process.env.SERVICE_FUNC;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const SUPPLIER_CONTRACT_ADDRESS = process.env.SUPPLIER_CONTRACT_ADDRESS;


// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
const supplierProcessContract = new ethers.Contract(SUPPLIER_CONTRACT_ADDRESS, supplierContract.abi, signer);

async function executeSupplierService() {
    // User's Input data
    const proposalId = "65908872035770777341973726447457749110153957073450315940479581955591728073993";
    const supplier_name = "Centro Ortopédico da Parede";
    const supplier_address = process.env.SUPPLIER_MEMBER_1;
    const proposal_description = "I Propose to My Company C.O.P. to provide a service to your Public Instituition!";

    
    const functionToCall = SERVICE_FUNC;
    const encodedFunctionCall = supplierProcessContract.interface.encodeFunctionData(functionToCall, [supplier_name, supplier_address])
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