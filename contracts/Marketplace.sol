// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IDataNFT {
  function ownerOf(uint256 tokenId) external view returns (address);
  function totalSupply() external view returns (uint256);
}

contract Marketplace is Ownable {
  IDataNFT public immutable dataNFT;

  struct UserStats {
    uint256 uploads;     // set when mint happens (call from frontend or emit hook)
    uint256 salesCount;  // total number of purchases of their items
    uint256 credits;     // wei accrued from royalties/sales
  }

  struct ItemStats {
    uint256 sales;       // number of times this token was purchased
  }

  mapping(address => UserStats) public userStats;
  mapping(uint256 => ItemStats) public itemStats;
  mapping(address => uint256[]) public ownedTokens;   // assets the user bought via this marketplace

  uint96 public feeBps = 250; // 2.5% fee; 0 if you don't need it. Remainder to creator.

  event Purchased(address indexed buyer, uint256 indexed tokenId, uint256 price, uint256 toCreator);
  event CreditsAccrued(address indexed owner, uint256 amount);
  event CreditsWithdrawn(address indexed owner, uint256 amount);
  event UploadCountBumped(address indexed owner, uint256 newCount); // optional helper

  constructor(address _dataNFT, address initialOwner) Ownable(initialOwner) {
    dataNFT = IDataNFT(_dataNFT);
  }

  // simple fixed-price purchase for demo (you can pass price from UI)
  function purchase(uint256 tokenId) external payable {
    address owner = dataNFT.ownerOf(tokenId);
    require(owner != address(0) && owner != msg.sender, "bad owner/buyer");
    uint256 price = msg.value;
    require(price > 0, "no value");

    uint256 fee = (price * feeBps) / 10_000;
    uint256 toCreator = price - fee;

    // accrue credits to creator
    userStats[owner].credits += toCreator;
    userStats[owner].salesCount += 1;
    itemStats[tokenId].sales += 1;
    ownedTokens[msg.sender].push(tokenId);

    emit CreditsAccrued(owner, toCreator);
    emit Purchased(msg.sender, tokenId, price, toCreator);
  }

  function withdrawCredits() external {
    uint256 amt = userStats[msg.sender].credits;
    require(amt > 0, "no credits");
    userStats[msg.sender].credits = 0;
    (bool ok,) = msg.sender.call{value: amt}("");
    require(ok, "xfer fail");
    emit CreditsWithdrawn(msg.sender, amt);
  }

  // helper your frontend can call right after mint
  function bumpUpload(address owner) external {
    // in production: restrict (e.g., only DataNFT or a trusted minter can call)
    userStats[owner].uploads += 1;
    emit UploadCountBumped(owner, userStats[owner].uploads);
  }

  // views for UI
  function getUserSummary(address who) external view returns (
    uint256 uploads, uint256 salesCount, uint256 credits, uint256 ownedCount
  ) {
    UserStats memory s = userStats[who];
    return (s.uploads, s.salesCount, s.credits, ownedTokens[who].length);
  }

  function getOwnedTokens(address who) external view returns (uint256[] memory) {
    return ownedTokens[who];
  }

  // Get item stats
  function getItemStats(uint256 tokenId) external view returns (uint256 sales) {
    return itemStats[tokenId].sales;
  }

  // Update fee percentage (only owner)
  function setFeeBps(uint96 newFeeBps) external onlyOwner {
    require(newFeeBps <= 1000, "fee too high"); // max 10%
    feeBps = newFeeBps;
  }
}
