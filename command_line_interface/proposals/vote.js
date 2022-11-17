const { ethers } = require("hardhat");
const question  = require("./cli_questions");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");

const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;

async function main() {
    // User's Input proposal index
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = parseInt(await question.vote_way_request());
    const reason = await question.vote_reason_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer - Deployer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);

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