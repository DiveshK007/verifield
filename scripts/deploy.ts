import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const DataNFT = await ethers.getContractFactory("DataNFT");
  const dataNft = await DataNFT.deploy(deployer.address);
  await dataNft.waitForDeployment();
  console.log("DataNFT:", await dataNft.getAddress());

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const market = await Marketplace.deploy(deployer.address);
  await market.waitForDeployment();
  console.log("Marketplace:", await market.getAddress());

  const VerifierRegistry = await ethers.getContractFactory("VerifierRegistry");
  const registry = await VerifierRegistry.deploy(deployer.address, await dataNft.getAddress());
  await registry.waitForDeployment();
  console.log("VerifierRegistry:", await registry.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
