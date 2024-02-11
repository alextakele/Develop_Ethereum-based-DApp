//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Refund {

    // Employer's address
    address public employer;

    // List of employees
    address[] public employees;

    // Constructor to set the employer as the contract deployer
    constructor() {
        employer = msg.sender;
    }

    // Structure to store contract specifications for each employee
    struct ContractSpec {
        int256 center_lat;
        int256 center_lon;
        int256 radius;
        uint8 budget;
        bool status;
    }

    // Mapping to store contract information for each employee
    mapping(address => ContractSpec) public contractInfo;

    // Private function to check if an employee already exists
    function checkExistence(address employee) private view returns(bool) {
        for (uint256 i = 0; i < employees.length; i++) {
            if (employee == employees[i]) {
                return true;
            }
        }
        return false;
    }
    
    // Public function to add an employee with contract specifications
    function addEmployee(address employee, int256 lat, int256 lon, int256 rad, uint8 budget) public {
        if (!checkExistence(employee)) {
            contractInfo[employee].center_lat = lat;
            contractInfo[employee].center_lon = lon;
            contractInfo[employee].radius = rad;
            contractInfo[employee].budget = budget;
            contractInfo[employee].status = false;
            employees.push(employee);
        }
    }

    // Public function to get the list of employees
    function getEmployees() public view returns(address[] memory) {
        return employees;
    }

    // Public function to calculate the square root of an integer
    function sqrt(int256 x) public pure returns (int256 y) {
        int256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // Private function to calculate the distance from the center for a given employee
    function calculateRadius(int256 lat, int256 lon, address adr) private view returns(int256) {
        int256 radius = 0;
        int256 x = lat - contractInfo[adr].center_lat;
        int256 y = lon - contractInfo[adr].center_lon;
        radius = sqrt(x**2 + y**2);
        return radius;
    }

    // Public function to check if the current location is within the specified radius for the employee
    function checkLocation(int256 lat, int256 lon) public {
        int256 rad = calculateRadius(lat, lon, msg.sender);
        if (rad < contractInfo[msg.sender].radius) {
            contractInfo[msg.sender].status = true;
        } else {
            contractInfo[msg.sender].status = false;
        }
    }

    // Public function to make a payment to the employee if conditions are met
    function pay(address payable _to) public {
        if (checkExistence(_to) && contractInfo[msg.sender].status == true) {
            bool sent = _to.send(contractInfo[_to].budget);
            require(sent, "Payment Failed");
            contractInfo[_to].status = false;
        }
    }
}
