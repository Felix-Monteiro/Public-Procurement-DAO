// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Initializing Administrative Access Control Interface
interface AdministrativeAccessControlIF {
    function verifyBoardMember(address board_Member_Address)
        external
        view
        returns (bool);
}

/*
  The Governance Token is a standard ERC20 token modified to allow 
  users to vote on proposals. Token balance does not account for 
  voting power, making transfers cheaper. The downside is that it 
  requires users to delegate to themselves in order to activate 
  checkpoints and have their voting power tracked.
*/
contract GovernanceToken is ERC20Votes, AccessControl {
    uint256 public constant s_maxSupply = 1;

    // Initializing Administrative Access Control Contract
    address constant AdministrativeAccessControlAddress =
        0x8E8b30861A8a35CD9254FF1ccf3d458F4e216271;
    AdministrativeAccessControlIF administrativeAccessControlContract =
        AdministrativeAccessControlIF(
            AdministrativeAccessControlAddress
        );

    constructor()
        ERC20("GovernanceToken", "GT")
        ERC20Permit("GovernanceToken")
    {}

    function _mintToken() public {
        // Access control for Board Members
        require(
            administrativeAccessControlContract.verifyBoardMember(msg.sender) ==
                true,
            "ERROR: Caller is not a Board Member!"
        );
        _mint(msg.sender, s_maxSupply);
        super.delegate(msg.sender);
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
}
