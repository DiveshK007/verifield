// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAccessManager {
    event GreenfieldPermissionRequired(address indexed buyer, string cid);
}

contract AccessManager is IAccessManager {
    address public immutable dataNFT;

    constructor(address dataNFT_) {
        dataNFT = dataNFT_;
    }

    function requestGreenfieldGrant(address buyer, string calldata cid) external {
        emit GreenfieldPermissionRequired(buyer, cid);
    }
}
