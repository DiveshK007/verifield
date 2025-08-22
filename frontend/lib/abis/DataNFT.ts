'use client';

import type { Abi } from 'viem';

// Minimal ABI surface needed for the app
export const dataNftAbi: Abi = [
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
    name: 'setVerified',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'value', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const;

export type DataNftAbi = Abi;


