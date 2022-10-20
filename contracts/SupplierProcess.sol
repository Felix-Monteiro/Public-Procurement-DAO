// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface AdministrativeAccessControlInterface {
    function _newSeniorSupplier(
        string memory _name,
        address _seniorSupplierAddress
    ) external;
}

contract SupplierProcess is Ownable {
    struct Service_Supplier {
        string name;
        address serviceSupplierAddress;
        uint256 reputation;
    }
    Service_Supplier[] public serviceSuppliers;

    // Initializing Administrative Access Control Contract
    address AdministrativeAccessControlAddress =
        0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9;

    AdministrativeAccessControlInterface administrativeAccessControlContract =
        AdministrativeAccessControlInterface(
            AdministrativeAccessControlAddress
        );

    // Emitted when the service supplier changes
    event NewServiceSupplier(
        string name,
        address serviceSupplierAddress,
        uint256 reputation
    );

    // Stores a new supplier in the contract
    function newServiceSupplier(
        string memory _name,
        address serviceSupplierAddress
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
                    administrativeAccessControlContract._newSeniorSupplier(
                        _name,
                        serviceSupplierAddress
                    );
                }
            }
        }
        if (current == false) {
            serviceSuppliers.push(
                Service_Supplier(_name, serviceSupplierAddress, 2) //change to 1
            );
            emit NewServiceSupplier(_name, serviceSupplierAddress, 2); //change to 1
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
}
