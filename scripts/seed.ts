import { ethers } from "hardhat";

async function main() {
  const [deployer, buyer] = await ethers.getSigners();
  const dataNftFactory = await ethers.getContractFactory("DataNFT");
  const marketplaceFactory = await ethers.getContractFactory("Marketplace");

  const dataNftAddress = process.env.DATANFT_ADDRESS || (await (await ethers.getContract("DataNFT")).getAddress());
  const marketAddress = process.env.MARKETPLACE_ADDRESS || (await (await ethers.getContract("Marketplace")).getAddress());
  const dataNft = await dataNftFactory.attach(dataNftAddress);
  const market = await marketplaceFactory.attach(marketAddress);

  console.log("Seeding datasets...");
  for (let i = 1; i <= 3; i++) {
    const tx = await dataNft.mint(`Seed Dataset #${i}`, `ipfs://seed-${i}`);
    await tx.wait();
  }
  console.log("Seeding purchase...");
  await market.connect(buyer).purchase(1, { value: 0 });
  console.log("Done.");
}

main().catch((e)=>{ console.error(e); process.exit(1) })

