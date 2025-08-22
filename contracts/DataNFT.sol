// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDataNFT.sol";

contract DataNFT is ERC721, Ownable, IDataNFT {
    uint256 private _tokenId;
    mapping(uint256 => Dataset) private _datasets;

    event Minted(uint256 indexed tokenId, address indexed to, string cid);
    event Verified(uint256 indexed tokenId, bool verified);

    constructor(address initialOwner) ERC721("DataNFT", "DATA") Ownable(initialOwner) {}

    function mint(address to, Dataset calldata meta) external override onlyOwner returns (uint256) {
        _tokenId += 1;
        _safeMint(to, _tokenId);
        _datasets[_tokenId] = Dataset({
            cid: meta.cid,
            sha256sum: meta.sha256sum,
            licenseUri: meta.licenseUri,
            domain: meta.domain,
            tags: meta.tags,
            verified: meta.verified
        });
        emit Minted(_tokenId, to, meta.cid);
        return _tokenId;
    }

    function setVerified(uint256 tokenId, bool v) external override onlyOwner {
        require(_ownerOf(tokenId) != address(0), "bad token");
        _datasets[tokenId].verified = v;
        emit Verified(tokenId, v);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "bad token");
        return string(abi.encodePacked("data:application/json;utf8,{\"name\":\"Data #", _toString(tokenId), "\"}"));
    }

    function getDataset(uint256 tokenId) external view override returns (Dataset memory) {
        require(_ownerOf(tokenId) != address(0), "bad token");
        return _datasets[tokenId];
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value; uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits -= 1; buffer[digits] = bytes1(uint8(48 + uint256(value % 10))); value /= 10; }
        return string(buffer);
    }
}