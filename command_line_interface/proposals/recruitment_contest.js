const { ethers } = require("hardhat");
var fs = require('fs');
const { readFileSync } = require('fs');
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminRecruitmentContract = require("../../artifacts/contracts/board_administration/AdministrativeRecruitmentProcess.sol/AdministrativeRecruitmentProcess.json");
const question = require("./cli_questions");

const proposalsFileInfo = process.env.proposalsFileInfo;
const proposalsFile = process.env.proposalsFile;
const CONTEST_FUNC = process.env.CONTEST_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS;

async function boardProposeContest(functionToCall) {
  // User's Input data
  const PRIVATE_KEY = await question.caller_private_key();
  const caller_address = await question.caller_address_request();
  const contest_name = await question.contest_name_request();
  const proposal_description = await question.proposal_description_request();

  // Provider - Alchemy
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
  // Signer
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  // Contracts Instances
  const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
  const administrativeRecruitmentContract = new ethers.Contract(ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS, adminRecruitmentContract.abi, signer);

  const encodedFunctionCall = administrativeRecruitmentContract.interface.encodeFunctionData(functionToCall, [contest_name]);

  console.log("_______________________________________________________________________________________\n")
  console.log(`Proposing Function: ${functionToCall} on ${administrativeRecruitmentContract.address} with Recruitment Contest: ${[contest_name]}`);
  console.log(`New Recruitment Contest Description:\n  ${proposal_description}\n`);

  const proposeTx = await governanceProtocolContract.AdministrativePropose(
    [administrativeRecruitmentContract.address],
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
    ["Index: " + proposalIndex.toString(), "Function: " + CONTEST_FUNC.toString(),
    "Caller Address: " + caller_address.toString(), "Recruitment Contest: " + contest_name.toString(),
    "Contest Description: " + proposal_description.toString()]);
  fs.writeFileSync(proposalsFileInfo, JSON.stringify(proposalsInfo, null, 2));

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`\nCurrent Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
};

boardProposeContest(CONTEST_FUNC)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })