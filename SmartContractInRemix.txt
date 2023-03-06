// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract details {

    struct student {
        string firstName;
        string scndName;
        int admNo;
    }
    mapping(int => student) details;

    function printHello(string memory _a) public pure returns(string memory) {
        return _a;
    }

    function setDetails(string memory _firstName, string memory _scndName, int _admNo ) public returns(student memory) {
        details[_admNo].firstName = _firstName;
        details[_admNo].scndName = _scndName;
        details[_admNo].admNo = _admNo;

        return details[_admNo];
    }

    function getDetails(int _admNo) public view returns(student memory) {
        return details[_admNo];
    }
}