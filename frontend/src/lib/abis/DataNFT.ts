export default [
  { "type":"function","name":"mint","stateMutability":"nonpayable","inputs":[{"name":"name","type":"string"},{"name":"uri","type":"string"}],"outputs":[{"name":"","type":"uint256"}] },
  { "type":"function","name":"tokenURI","stateMutability":"view","inputs":[{"name":"id","type":"uint256"}],"outputs":[{"name":"","type":"string"}] },
  { "type":"function","name":"nameOf","stateMutability":"view","inputs":[{"name":"id","type":"uint256"}],"outputs":[{"name":"","type":"string"}] }
] as const;
