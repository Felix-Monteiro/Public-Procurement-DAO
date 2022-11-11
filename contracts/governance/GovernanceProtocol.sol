// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface AdministrativeInterface {
    function retrieve() external view returns (string memory);
}

interface AdministrativeAccessControlInterface {
    function verifyBoardMember(address board_Member_Address)
        external
        view
        returns (bool);

    function verifySupplier(address supplier_address)
        external
        view
        returns (bool);
}

interface SupplierProcessInterface {
    function verifySeniorSupplier(address senior_supplier_address)
        external
        view
        returns (bool);
}

/*
  The GovernanceProtocol Contract has all the voting and proposal's logic 
  used in the system. Users interact with the GovernanceProtocol because 
  it is the only Proposer trusted by the TimeLock, but proposals are only 
  operated by the TimeLock. It is this relation between the GovernanceProtocol
  and TimeLock that makes this system a DAO.
*/

contract GovernanceProtocol is
    AccessControl,
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
        // Initializing Administrative Access Control Contract
    address AdministrativeAccessControlAddress =
        0x9Aa845D6CD7d5F2841299E276e6087CEE23a7d10;
    AdministrativeAccessControlInterface administrativeAccessControlContract =
        AdministrativeAccessControlInterface(
            AdministrativeAccessControlAddress
        );

    // Initializing Administrative Recruitment Contract
    address AdministrativeProcessAddress =
        0x67f9feE0faA6Ddc223Bd8ae1081e0ABCe27C1d52;
    AdministrativeInterface administrativeContract =
        AdministrativeInterface(AdministrativeProcessAddress);
    
    // Initializing Senior Supplier Contract
    address seniorSupplierProcessAddress =
        0x29c60d51d2C70f457708b3dB5f6098675F80bC1e;

    // Initializing Supplier Process Contract
    address supplierProcessAddress = 0x4b1D850CCFa382B0cE2879D5F8527C7C6DA6B088;
    SupplierProcessInterface supplierProcessInterface =
        SupplierProcessInterface(supplierProcessAddress);

    uint256 private proposalIndex = 0;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _votingDelay
    )
        Governor("GovernanceProtocol")
        GovernorSettings(
            _votingDelay, /* 1 block */ // votind delay
            _votingPeriod, // 45818, /* 1 week */ // voting period
            0 // proposal threshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    // Administrative Propose
    function AdministrativePropose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        bool unvalidTarget = false;
        // Verify that contract caller proposes on the right contract
        for (uint256 i = 0; i < targets.length; i++) {
            if (
                targets[i] != AdministrativeProcessAddress &&
                targets[i] != AdministrativeAccessControlAddress
            ) {
                unvalidTarget = true;
                break;
            }
        }
        require(
            unvalidTarget == false,
            "ERROR: Member tried to call an unvalid proposal"
        );

        // Access control for Board Members
        require(
            administrativeAccessControlContract.verifyBoardMember(msg.sender) ==
                true,
            "ERROR: Caller is not a Board Member!"
        );

        proposalIndex++;
        return super.propose(targets, values, calldatas, description);
    }

    // Supplier proposes a Service to a specific Recruitment Process
    function supplierPropose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        string memory proposalValue
    ) public returns (uint256) {
        string memory boardContest = administrativeContract.retrieve();
        bool unvalidTarget = false;

        // Verify that contract caller proposes on the right contract
        for (uint256 i = 0; i < targets.length; i++) {
            if (targets[i] != supplierProcessAddress) {
                unvalidTarget = true;
                break;
            }
        }
        require(
            unvalidTarget == false,
            "ERROR: Member tried to call an unvalid proposal"
        );

        // Verify if proposer is Supplier
        require(
            administrativeAccessControlContract.verifySupplier(msg.sender) ==
                true,
            "ERROR: Caller is not a Supplier!"
        );

        // Verify if Proposal corresponds with Board request
        require(
            keccak256(abi.encodePacked((boardContest))) ==
                keccak256(abi.encodePacked((proposalValue))),
            "ERROR: The Contest value requested was not found!"
        );

        proposalIndex++;
        return super.propose(targets, values, calldatas, description);
    }

    // Senior Supplier proposes a Feedback Proposal presented to the Board Members
    function seniorSupplierPropose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        bool unvalidTarget = false;

        // Verify that contract caller proposes on the right contract
        for (uint256 i = 0; i < targets.length; i++) {
            if (targets[i] != seniorSupplierProcessAddress && targets[i] != supplierProcessAddress) {
                unvalidTarget = true;
                break;
            }
        }
        require(
            unvalidTarget == false,
            "ERROR: Member tried to call an unvalid proposal"
        );

        // Verify if proposer is Senior Supplier
        require(
            supplierProcessInterface.verifySeniorSupplier(msg.sender) == true,
            "ERROR: Caller is not a Senior Supplier!"
        );

        proposalIndex++;
        return super.propose(targets, values, calldatas, description);
    }

    // Votes from Board Members
    function castBoardVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) public virtual returns (uint256) {
        // Verify if Voter is Board Member - Sender requires Governance Tokens
        require(
            administrativeAccessControlContract.verifyBoardMember(msg.sender) ==
                true,
            "ERROR: Caller is not a Board Member!"
        );

        return _castVote(proposalId, msg.sender, support, reason);
    }

    function retrieveProposalIndex() public view returns (uint256) {
        return proposalIndex - 1;
    }

    // The following functions are overrides required by Solidity

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}