// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplierProcess is AccessControl, Ownable {
    // Access Control Roles
    bytes32 public constant SENIOR_SUPPLIER_MEMBER =
        keccak256("SENIOR_SUPPLIER_MEMBER");
    bytes32 public constant SUPPLIER_MEMBER = 
        keccak256("SUPPLIER_MEMBER");

    /************** Roles Structures **************/
    
    struct Service_Supplier {
        string name;
        address serviceSupplierAddress;
        uint256 reputation;
    }
    Service_Supplier[] public serviceSuppliers;

    struct Senior_Supplier {
        string name;
        address seniorSupplierAddress;
    }
    Senior_Supplier[] public seniorSuppliers;
    
    /************** Service Supplier **************/
    
    // Emitted when the service supplier changes
    event NewServiceSupplier(
        string name,
        address serviceSupplierAddress,
        uint256 reputation
    );

    // Stores a new supplier in the contract
    function _newServiceSupplier(
        string memory _name,
        address _serviceSupplierAddress
    ) public onlyOwner {
        bool current = false;
        for (uint256 i = 0; i < serviceSuppliers.length; i++) {
            if (
                keccak256(abi.encodePacked((_name))) ==
                keccak256(abi.encodePacked((serviceSuppliers[i].name)))
            ) {
                current = true;
                if (serviceSuppliers[i].reputation < 3) {
                    serviceSuppliers[i].reputation =
                        serviceSuppliers[i].reputation +
                        1;
                }
                if (serviceSuppliers[i].reputation == 3) {
                    require(
                        hasRole(
                            SENIOR_SUPPLIER_MEMBER,
                            _serviceSupplierAddress
                        ) == false,
                        "ERROR: Account is already a Senior Supplier!"
                    );
                    uint256 id = seniorSuppliers.length + 1;
                    _setupRole(SENIOR_SUPPLIER_MEMBER, _serviceSupplierAddress);
                    seniorSuppliers.push(
                        Senior_Supplier(_name, _serviceSupplierAddress)
                    );

                    emit NewSeniorSupplier(id, _name, _serviceSupplierAddress);
                }
            }
        }
        if (current == false) {
            serviceSuppliers.push(
                Service_Supplier(_name, _serviceSupplierAddress, 1)
            );
            emit NewServiceSupplier(_name, _serviceSupplierAddress, 1);
        }
    }

    // Reads the stored supplier value
    function retrieveSuppliers()
        public
        view
        returns (Service_Supplier[] memory)
    {
        return serviceSuppliers;
    }

    /************** Senior Supplier Role **************/

    // Emitted when a new Senior Supplier is added
    event NewSeniorSupplier(
        uint256 seniorSupplierId,
        string name,
        address seniorSupplierAddress
    );

    // Emitted when a Senior Supplier is revoked
    event RevokedSeniorSupplier(
        uint256 seniorSupplierId,
        address seniorSupplierAddress
    );

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
    function retrieveSeniorSupplier(uint256 id)
        public
        view
        returns (string memory)
    {
        uint256 index = id - 1;
        return seniorSuppliers[index].name;
    }

    // Removes Senior Supplier by shifting
    function _revokeSeniorSupplier(uint256 _id, address _seniorSupplierAddress)
        public
        onlyOwner
    {
        uint256 index = _id - 1;
        require(
            hasRole(SENIOR_SUPPLIER_MEMBER, _seniorSupplierAddress),
            "ERROR: Account provided is not a Senior Supplier!"
        );
        require(index < seniorSuppliers.length, "ERROR: Index out of bound!");

        _revokeRole(SENIOR_SUPPLIER_MEMBER, _seniorSupplierAddress);

        for (uint256 i = index; i < seniorSuppliers.length - 1; i++) {
            seniorSuppliers[i] = seniorSuppliers[i + 1];
        }
        seniorSuppliers.pop();

        emit RevokedSeniorSupplier(_id, _seniorSupplierAddress);
    }
}
