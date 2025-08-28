export default [
  { "type":"function","name":"mint","stateMutability":"nonpayable","inputs":[{"name":"name","type":"string"},{"name":"uri","type":"string"}],"outputs":[{"name":"","type":"uint256"}] },
  { "type":"function","name":"tokenURI","stateMutability":"view","inputs":[{"name":"id","type":"uint256"}],"outputs":[{"name":"","type":"string"}] },
  { "type":"function","name":"nameOf","stateMutability":"view","inputs":[{"name":"id","type":"uint256"}],"outputs":[{"name":"","type":"string"}] },
  { "type":"event","name":"Transfer","inputs":[
    {"name":"from","type":"address","indexed":true},
    {"name":"to","type":"address","indexed":true},
    {"name":"tokenId","type":"uint256","indexed":true}
  ]}
] as const;
