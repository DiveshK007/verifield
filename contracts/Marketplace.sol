// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IDataAccessEmitter {
    event AccessGranted(address indexed buyer, address indexed nft, uint256 indexed tokenId);
}

contract Marketplace is Ownable, IDataAccessEmitter {
    struct Listing { address nft; uint256 tokenId; uint256 price; address seller; bool active; }
    mapping(bytes32 => Listing) public listings;

    event Listed(address indexed nft, uint256 indexed tokenId, uint256 price, address seller);
    event Delisted(address indexed nft, uint256 indexed tokenId);
    event Purchased(address indexed nft, uint256 indexed tokenId, address buyer, uint256 price);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function _key(address nft, uint256 tokenId) internal pure returns (bytes32) {
        return keccak256(abi.encode(nft, tokenId));
    }

    function list(address nft, uint256 tokenId, uint256 price) external {
        IERC721 erc = IERC721(nft);
        require(erc.ownerOf(tokenId) == msg.sender, "not owner");
        require(erc.isApprovedForAll(msg.sender, address(this)) || erc.getApproved(tokenId) == address(this), "not approved");
        bytes32 k = _key(nft, tokenId);
        listings[k] = Listing({nft: nft, tokenId: tokenId, price: price, seller: msg.sender, active: true});
        emit Listed(nft, tokenId, price, msg.sender);
    }

    function delist(address nft, uint256 tokenId) external {
        bytes32 k = _key(nft, tokenId);
        Listing memory L = listings[k];
        require(L.active, "not active");
        require(L.seller == msg.sender, "not seller");
        delete listings[k];
        emit Delisted(nft, tokenId);
    }

    function buy(address nft, uint256 tokenId) external payable {
        bytes32 k = _key(nft, tokenId);
        Listing memory L = listings[k];
        require(L.active, "not listed");
        require(msg.value >= L.price, "insufficient");
        delete listings[k];
        (bool ok, ) = L.seller.call{value: L.price}("");
        require(ok, "pay fail");
        emit Purchased(nft, tokenId, msg.sender, L.price);
        emit AccessGranted(msg.sender, nft, tokenId);
    }
}
