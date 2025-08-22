import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const DataNFT = await ethers.getContractFactory("DataNFT");
  const dataNft = await DataNFT.deploy(deployer.address);
  await dataNft.waitForDeployment();
  console.log("DataNFT:", await dataNft.getAddress());

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const market = await Marketplace.deploy(await dataNft.getAddress(), deployer.address);
  await market.waitForDeployment();
  console.log("Marketplace:", await market.getAddress());

  const VerifierRegistry = await ethers.getContractFactory("VerifierRegistry");
  const registry = await VerifierRegistry.deploy(deployer.address, await dataNft.getAddress());
  await registry.waitForDeployment();
  console.log("VerifierRegistry:", await registry.getAddress());

  // Set the verifier registry in the DataNFT contract
  const setRegistryTx = await dataNft.setVerifierRegistry(await registry.getAddress());
  await setRegistryTx.wait();
  console.log("VerifierRegistry set in DataNFT");

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("DataNFT:", await dataNft.getAddress());
  console.log("Marketplace:", await market.getAddress());
  console.log("VerifierRegistry:", await registry.getAddress());
  console.log("\nAll contracts deployed successfully! 🎉");
  
  console.log("\nEnvironment Variables to add to frontend/.env.local:");
  console.log("==================================================");
  console.log(`NEXT_PUBLIC_DATANFT_ADDRESS=${await dataNft.getAddress()}`);
  console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${await market.getAddress()}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=31337`);
  console.log(`NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`);
  console.log(`NEXT_PUBLIC_APP_NAME=VeriField`);
  console.log(`NEXT_PUBLIC_STORAGE_GATEWAY=https://ipfs.io/ipfs/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
