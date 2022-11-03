// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AdministrativeRecruitmentProcess is Ownable {
  string private contest;

  // Emitted when the stored value changes
  event NewRecruitment(string newContest);

  // Stores a new value in the contract
  function newContest(string memory _newContest) public onlyOwner {
    contest = _newContest;
    emit NewRecruitment(_newContest);
  }

  // Reads the last stored value
  function retrieve() public view returns (string memory) {
    return contest;
  }
}
