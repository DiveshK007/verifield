export default [
  { type: 'function', name: 'purchase', stateMutability: 'payable', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'withdrawCredits', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'getUserSummary', stateMutability: 'view', inputs: [{ name: 'who', type: 'address' }], outputs: [
    { name: 'uploads', type: 'uint256' },
    { name: 'salesCount', type: 'uint256' },
    { name: 'credits', type: 'uint256' },
    { name: 'ownedCount', type: 'uint256' },
  ] },
  { type: 'function', name: 'getOwnedTokens', stateMutability: 'view', inputs: [{ name: 'who', type: 'address' }], outputs: [
    { name: '', type: 'uint256[]' },
  ] },
  { type: 'function', name: 'getItemStats', stateMutability: 'view', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [
    { name: 'purchases', type: 'uint256' },
  ] },
  { type: 'function', name: 'feeBps', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint96' }] },
  { type: 'event', name: 'Purchased', inputs: [
    { name: 'buyer', type: 'address', indexed: true },
    { name: 'tokenId', type: 'uint256', indexed: true },
    { name: 'amount', type: 'uint256', indexed: false }
  ]},
] as const;

