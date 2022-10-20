// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/* 
  The TimeLock Contract works as the Owner of the non-governance contracts
  and forces proposals from the GovernanceProtocol to wait before execution, 
  providing members time to abandon if they disagree with a governance decision.
*/
contract TimeLock is TimelockController {
  // minDelay - how long to wait before executing
  // proposers - list of addresses that can propose
  // executors - list of addresses that can execute
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}