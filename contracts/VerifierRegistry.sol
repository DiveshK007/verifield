// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IDataNFT.sol";

contract VerifierRegistry is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private _verifiers;
    IDataNFT public dataNFT;

    event VerifierSet(address indexed who, bool enabled);
    event DatasetVerified(uint256 indexed tokenId, bool verified);

    constructor(address initialOwner, address dataNFT_) Ownable(initialOwner) {
        dataNFT = IDataNFT(dataNFT_);
    }

    function setVerifier(address who, bool enabled) external onlyOwner {
        if (enabled) _verifiers.add(who); else _verifiers.remove(who);
        emit VerifierSet(who, enabled);
    }

    modifier onlyVerifier() { require(_verifiers.contains(msg.sender) || msg.sender == owner(), "not verifier"); _; }

    function setVerified(uint256 tokenId, bool v) external onlyVerifier {
        dataNFT.setVerified(tokenId, v);
        emit DatasetVerified(tokenId, v);
    }

    function isVerifier(address who) external view returns (bool) { return _verifiers.contains(who); }
}
