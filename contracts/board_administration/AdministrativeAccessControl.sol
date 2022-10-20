// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AdministrativeAccessControl is AccessControl, Ownable {
    // Access Control Roles
    bytes32 public constant BOARD_MEMBER = keccak256("BOARD_MEMBER");
    bytes32 public constant SUPPLIER_MEMBER = keccak256("SUPPLIER_MEMBER");
    bytes32 public constant SENIOR_SUPPLIER_MEMBER = keccak256("SENIOR_SUPPLIER_MEMBER");

    //address supplierProcessAddress = 0x610178dA211FEF7D417bC0e6FeD39F05609AD788;

    // Structures of each Role
    struct Board_Member {
        string name;
        address boardMemberAddress;
    }
    Board_Member[] public boardMembers;

    struct Supplier {
        string name;
        address supplierAddress;
    }
    Supplier[] public suppliers;

    struct Senior_Supplier {
        string name;
        address seniorSupplierAddress;
    }
    Senior_Supplier[] public seniorSuppliers;

    constructor(
        string[] memory initialBoardMembersNames,
        address[] memory initialBoardMembers
    ) {
        // Setting initial Board Member roles
        for (uint256 i = 0; i < initialBoardMembers.length; i++) {
            _setupRole(BOARD_MEMBER, initialBoardMembers[i]);
            boardMembers.push(
                Board_Member(
                    initialBoardMembersNames[i],
                    initialBoardMembers[i]
                )
            );
        }
    }

    /**************  Board Member Role **************/

    // Emitted when a new BoardMember is added
    event NewBoardMember(
        uint256 boardMemberId,
        string name,
        address boardMemberAddress
    );

    // Emitted when a BoardMember is revoked
    event RevokedBoardMember(uint256 boardMemberId, address boardMemberAddress);

    // Adds a new Board Member to a list of BoardMembers & assigns BOARD_MEMBER Role
    function _newBoardMember(string memory _name, address _boardMemberAddress)
        public
        onlyOwner
    {
        require(
            hasRole(BOARD_MEMBER, _boardMemberAddress) == false,
            "ERROR: Account is already a Board Member!"
        );

        uint256 id = boardMembers.length + 1;
        _setupRole(BOARD_MEMBER, _boardMemberAddress);
        boardMembers.push(Board_Member(_name, _boardMemberAddress));

        emit NewBoardMember(id, _name, _boardMemberAddress);
    }

    // Verifies if address is a Board Member
    function verifyBoardMember(address board_Member_Address)
        public
        view
        returns (bool)
    {
        bool verify = hasRole(BOARD_MEMBER, board_Member_Address);
        return verify;
    }

    // Retrieves BoardMember name based on BoardMember ID
    function retrieveBoardMember(uint256 id)
        public
        view
        returns (string memory)
    {
        uint256 index = id - 1;
        return boardMembers[index].name;
    }

    // Removes BoardMember by shifting
    function _revokeBoardMember(uint256 id, address board_Member_Address)
        public
        onlyOwner
    {
        uint256 index = id - 1;
        require(
            hasRole(BOARD_MEMBER, board_Member_Address),
            "ERROR: Account provided is not a Board Member!"
        );
        require(index < boardMembers.length, "ERROR: Index out of bound!");

        _revokeRole(BOARD_MEMBER, board_Member_Address);

        for (uint256 i = index; i < boardMembers.length - 1; i++) {
            boardMembers[i] = boardMembers[i + 1];
        }
        boardMembers.pop();

        emit RevokedSupplier(id, board_Member_Address);
    }

    /************** Supplier Role **************/

    // Emitted when a new Supplier is added
    event NewSupplier(uint256 supplierId, string name, address supplierAddress);

    // Emitted when a Supplier is revoked
    event RevokedSupplier(uint256 supplierId, address supplierAddress);

    // Adds a new Supplier to a list of Suppliers & assigns Supplier Role
    function _newSupplier(string memory _name, address _supplierAddress)
        public
        onlyOwner
    {
        require(
            hasRole(SUPPLIER_MEMBER, _supplierAddress) == false,
            "ERROR: Account is already a Supplier!"
        );
        require(
            hasRole(BOARD_MEMBER, _supplierAddress) == false,
            "ERROR: The Account provided is a Board Member. Board Members cannot become Suppliers!"
        );

        uint256 id = suppliers.length + 1;
        _setupRole(SUPPLIER_MEMBER, _supplierAddress);
        suppliers.push(Supplier(_name, _supplierAddress));

        emit NewSupplier(id, _name, _supplierAddress);
    }

    // Verifies if address is a Supplier
    function verifySupplier(address supplier_address)
        public
        view
        returns (bool)
    {
        bool verify = hasRole(SUPPLIER_MEMBER, supplier_address);
        return verify;
    }

    // Retrieves Supplier name based on Supplier ID
    function retrieveSupplier(uint256 id) public view returns (string memory) {
        uint256 index = id - 1;
        return suppliers[index].name;
    }

    // Removes Supplier by shifting
    function _revokeSupplier(uint256 id, address supplier_address)
        public
        onlyOwner
    {
        uint256 index = id - 1;
        require(
            hasRole(SUPPLIER_MEMBER, supplier_address),
            "ERROR: Account provided is not a Supplier!"
        );
        require(index < suppliers.length, "ERROR: Index out of bound!");

        _revokeRole(SUPPLIER_MEMBER, supplier_address);

        for (uint256 i = index; i < suppliers.length - 1; i++) {
            suppliers[i] = suppliers[i + 1];
        }
        suppliers.pop();

        emit RevokedSupplier(id, supplier_address);
    }

    /************** Senior Supplier Role **************/

    // Emitted when a new Senior Supplier is added
    event NewSeniorSupplier(uint256 seniorSupplierId, string name, address seniorSupplierAddress);

    // Emitted when a Senior Supplier is revoked
    event RevokedSeniorSupplier(uint256 seniorSupplierId, address seniorSupplierAddress);

    // Adds a new Senior Supplier to a list of Senior Suppliers & assigns Senior Supplier Role
    function _newSeniorSupplier(string memory _name, address _seniorSupplierAddress)
        public
    {
        //TODO: This requirement comes before supplier Process is deployed (Possible test net issue)
        //require(msg.sender == supplierProcessAddress , "ERROR: Unnauthorized contract call");
        require(
            hasRole(SENIOR_SUPPLIER_MEMBER, _seniorSupplierAddress) == false,
            "ERROR: Account is already a Senior Supplier!"
        );
        require(
            hasRole(SUPPLIER_MEMBER, _seniorSupplierAddress),
            "ERROR: Account provided is not a Supplier! To obtain a Senior Role the member needs to be a regitered Supplier."
        );

        uint256 id = seniorSuppliers.length + 1;
        _setupRole(SENIOR_SUPPLIER_MEMBER, _seniorSupplierAddress);
        seniorSuppliers.push(Senior_Supplier(_name, _seniorSupplierAddress));

        emit NewSeniorSupplier(id, _name, _seniorSupplierAddress);
    }

    // Verifies if address is a Senior Supplier
    function verifySeniorSupplier(address senior_supplier_address)
        public
        view
        returns (bool)
    {
        bool verify = hasRole(SENIOR_SUPPLIER_MEMBER, senior_supplier_address);
        return verify;
    }

    // Retrieves Senior Supplier name based on Supplier ID
    function retrieveSeniorSupplier(uint256 id) public view returns (string memory) {
        uint256 index = id - 1;
        return seniorSuppliers[index].name;
    }

    // Removes Senior Supplier by shifting
    function _revokeSeniorSupplier(uint256 id, address senior_supplier_address)
        public
        onlyOwner
    {
        uint256 index = id - 1;
        require(
            hasRole(SENIOR_SUPPLIER_MEMBER, senior_supplier_address),
            "ERROR: Account provided is not a Senior Supplier!"
        );
        require(index < seniorSuppliers.length, "ERROR: Index out of bound!");

        _revokeRole(SENIOR_SUPPLIER_MEMBER, senior_supplier_address);

        for (uint256 i = index; i < seniorSuppliers.length - 1; i++) {
            seniorSuppliers[i] = seniorSuppliers[i + 1];
        }
        seniorSuppliers.pop();

        emit RevokedSeniorSupplier(id, senior_supplier_address);
    }
}
