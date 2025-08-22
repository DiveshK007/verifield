'use client';

import type { Abi } from 'viem';

// Minimal ABI surface needed for the app
export const dataNftAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      {
        name: 'meta',
        type: 'tuple',
        components: [
          { name: 'cid', type: 'string' },
          { name: 'sha256sum', type: 'string' },
          { name: 'licenseUri', type: 'string' },
          { name: 'domain', type: 'string' },
          { name: 'tags', type: 'string[]' },
          { name: 'verified', type: 'bool' },
        ],
      },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getDataset',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        name: 'dataset',
        type: 'tuple',
        components: [
          { name: 'cid', type: 'string' },
          { name: 'sha256sum', type: 'string' },
          { name: 'licenseUri', type: 'string' },
          { name: 'domain', type: 'string' },
          { name: 'tags', type: 'string[]' },
          { name: 'verified', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'Minted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'cid', type: 'string', indexed: false },
    ],
  },
] as const satisfies Abi;

export type DataNftAbi = typeof dataNftAbi;


