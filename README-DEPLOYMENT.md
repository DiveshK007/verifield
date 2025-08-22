# VeriField - Hackathon Deployment Guide

## 🚀 Quick Deploy to opBNB Testnet

### 1. Setup Environment
```bash
# Create .env file in project root
PRIVATE_KEY=your_metamask_private_key
BSC_API_KEY=optional_for_verification

# Frontend .env.local
NEXT_PUBLIC_DATANFT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=5611
NEXT_PUBLIC_RPC_URL=https://opbnb-testnet-rpc.bnbchain.org
NEXT_PUBLIC_APP_NAME=VeriField
NEXT_PUBLIC_STORAGE_GATEWAY=https://ipfs.io/ipfs/
```

### 2. Get Test Tokens
- Visit: https://opbnb-testnet-bridge.bnbchain.org/deposit
- Bridge some BNB from BSC testnet to opBNB testnet
- Or use faucet: https://testnet.bnbchain.org/faucet-smart

### 3. Deploy Contracts
```bash
pnpm hardhat run scripts/deploy.ts --network opbnb_testnet
```

### 4. Update Frontend Config
Copy deployed contract address to `NEXT_PUBLIC_DATANFT_ADDRESS`

### 5. Build & Deploy Frontend
```bash
pnpm -C frontend build
# Deploy to Vercel/Netlify/your preferred host
```

## 🎯 Hackathon Tracks

**Primary Track: DeSci** 📊
- Research dataset verification
- Scientific data provenance
- Open science on blockchain

**Secondary Track: AI** 🤖  
- ML dataset marketplace
- Training data verification
- On-chain analytics

## 🎬 Demo Video Script

1. **Problem** (30s): "AI researchers can't trust datasets"
2. **Solution** (30s): "VeriField = blockchain-verified datasets"
3. **Demo** (90s): Upload → Mint → Verify → Browse
4. **Impact** (30s): "Revolutionizing scientific data trust"

## 🏆 Winning Features

✅ **Novel Use Case**: First dataset NFT marketplace on BNB
✅ **Technical Excellence**: Modern stack + clean code
✅ **Real Problem**: Solves actual AI/research pain points
✅ **BNB Integration**: Perfect fit for opBNB's fast/cheap txs
✅ **Multi-Track**: Hits DeSci + AI simultaneously
