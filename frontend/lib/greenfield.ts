export async function sponsoredUpload(file: File, meta: any) {
  // Generate a more realistic mock Greenfield CID
  const timestamp = Date.now();
  const randomHex = Math.random().toString(36).slice(2, 10);
  const mockCid = `greenfield://mock-cid-${timestamp}-${randomHex}`;
  
  // Generate a realistic mock SHA256 hash
  const mockSha256 = '0x' + Array.from({length: 32}, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  
  return {
    cid: mockCid,
    sha256: mockSha256,
    size: file.size,
  };
}

export async function grantDownload(cid: string, buyer: string) {
  // Mock successful grant
  return true;
}
