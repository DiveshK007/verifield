# VeriField — DeSci Data Marketplace on BNB Chain

BNB-native marketplace for **scientific & climate datasets** with:
- **Sponsor-paid uploads** on BNB Greenfield (no-fee UX for contributors)
- **DataNFT** minting & listings on BSC testnet
- **Verified badge** for trusted NGO/academic data
- **AI semantic tagging & search (stub)**

## Quickstart

### 1) Contracts (Hardhat)
```bash
pnpm i
pnpm hardhat compile
pnpm hardhat run scripts/deploy.ts --network bsc_testnet
```

### 2) Frontend (Next.js App Router)
```bash
cd frontend
pnpm i
cp .env.example .env.local  # fill values
pnpm dev
```

### 3) Demo Flow
1. Upload dataset (CSV/JSON) → stored on **Greenfield** via sponsored upload
2. Mint **DataNFT** with metadata (CID, hash, license, tags)
3. List on Marketplace; buyer purchases
4. API route listens to purchase → sets Greenfield permission for buyer
5. Buyer downloads dataset

> Hackathon scaffold: keys/permissions simplified for demo. Never commit secrets.
