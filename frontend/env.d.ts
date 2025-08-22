/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DATANFT_ADDRESS: string;
    NEXT_PUBLIC_CHAIN_ID: string;
    NEXT_PUBLIC_RPC_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_STORAGE_GATEWAY: string;
  }
}


