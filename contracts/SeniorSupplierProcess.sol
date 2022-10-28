// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SeniorSupplierProcess is Ownable {
  string private feedback;

  // Emitted when the stored value changes
  event NewFeedback(string newFeedback);

  // Stores a new Feedback in the contract
  function newFeedback(string memory _newFeedback) public onlyOwner {
    feedback = _newFeedback;
    emit NewFeedback(_newFeedback);
  }

  // Reads the last stored Feedback
  function retrieve() public view returns (string memory) {
    return feedback;
  }
}