// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDataNFT {
    struct Dataset {
        string cid;       // Greenfield/IPFS CID
        bytes32 sha256sum;
        string licenseUri;  // e.g. CC-BY, ODC-BY
        string domain;      // e.g. climate, health
        string[] tags;
        bool verified;
    }

    function mint(address to, Dataset calldata meta) external returns (uint256);
    function setVerified(uint256 tokenId, bool v) external;
    function getDataset(uint256 tokenId) external view returns (Dataset memory);
}
