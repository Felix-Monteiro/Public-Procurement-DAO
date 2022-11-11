const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);

async function main() {

    // You could swap this out for the ID you want to use too
    const proposalId = "65908872035770777341973726447457749110153957073450315940479581955591728073993";

    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1;
    const reason = "A Good contestant!";

    console.log("Voting...");
    const voteTx = await governanceProtocolContract.castBoardVoteWithReason(proposalId, voteWay, reason)
    const voteTxReceipt = await voteTx.wait();
    console.log(voteTxReceipt.events[0].args.reason);
    const proposalState = await governanceProtocolContract.state(proposalId);

    console.log(`Current Administrative Access Control Proposal State: ${proposalState}`)
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });