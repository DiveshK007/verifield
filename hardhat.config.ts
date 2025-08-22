import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    opbnb_testnet: {
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      chainId: 5611,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000,
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
      gas: 8000000,
    },
  },
  etherscan: {
    apiKey: {
      opbnb_testnet: "your-api-key", // Not required for testnet
      bsc_testnet: process.env.BSC_API_KEY || "",
    },
    customChains: [
      {
        network: "opbnb_testnet",
        chainId: 5611,
        urls: {
          apiURL: "https://open-platform.nodereal.io/opbnb-testnet/contract/",
          browserURL: "https://opbnb-testnet.bscscan.com/",
        },
      },
    ],
  },
};

export default config;