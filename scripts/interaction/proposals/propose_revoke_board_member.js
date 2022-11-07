const { ethers } = require("hardhat");
var fs = require('fs');
const { readFileSync } = require('fs');
const governanceContract = require("../../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminAccessControlContract = require("../../../artifacts/contracts/board_administration/AdministrativeAccessControl.sol/AdministrativeAccessControl.json");

const proposalsFileInfo = process.env.proposalsFileInfo;
const proposalsFile = process.env.proposalsFile;
const BOARD_MEMBER_RMV_FUNC = process.env.BOARD_MEMBER_RMV_FUNC;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMIN_AC_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_ACCESS_CONTROL_ADDRESS;

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
const administrativeAccessControlContract = new ethers.Contract(ADMIN_AC_CONTRACT_ADDRESS, adminAccessControlContract.abi, signer);

async function boardProposeRevokeBoardMember(functionToCall) {

  // User's Input data
  const caller_address = process.env.BOARD_MEMBER_1;
  const board_member_id = 1;
  const board_member_address = process.env.BOARD_MEMBER_NEW;
  const proposal_description = "This is a bad Board Member for our company";

  const encodedFunctionCall = administrativeAccessControlContract.interface.encodeFunctionData(functionToCall, [board_member_id, board_member_address]);

  console.log("_______________________________________________________________________________________\n");
  console.log(`Proposing Function: ${functionToCall} on ${administrativeAccessControlContract.address}`);
  console.log(`Proposed Board Member ID: ${board_member_id} with address: ${board_member_address}`);
  console.log(`Revoke Board Member Proposal Description:\n  ${proposal_description}\n`);

  const proposeTx = await governanceProtocolContract.AdministrativePropose(
    [administrativeAccessControlContract.address],
    [0],
    [encodedFunctionCall],
    proposal_description
  );

  const proposeReceipt = await proposeTx.wait();
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`\nProposed with proposal ID:\n  ${proposalId}`);

  const proposalState = await governanceProtocolContract.state(proposalId);
  const proposalSnapShot = await governanceProtocolContract.proposalSnapshot(proposalId);
  const proposalDeadline = await governanceProtocolContract.proposalDeadline(proposalId);
  const proposalIndex = await governanceProtocolContract.retrieveProposalIndex();

  // Save Proposal in JSON file
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals["goerli"].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2));

  let proposalsInfo = JSON.parse(readFileSync(proposalsFileInfo, "utf8"));
  proposalsInfo["goerli"].push("ID: " + proposalId.toString(),
    ["Index: " + proposalIndex.toString(), "Function: " + BOARD_MEMBER_RMV_FUNC.toString(),
    "Caller Address: " + caller_address.toString(), "Board Member ID: " + board_member_id.toString(),
    "Board Member Address: " + board_member_address.toString(), "Proposal Description: " + proposal_description.toString()]);
  fs.writeFileSync(proposalsFileInfo, JSON.stringify(proposalsInfo, null, 2));

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`\nCurrent Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
};

boardProposeRevokeBoardMember(BOARD_MEMBER_RMV_FUNC)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })