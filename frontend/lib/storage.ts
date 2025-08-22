'use client';

export function resolveCidUrl(cid: string): string {
  const base = process.env.NEXT_PUBLIC_STORAGE_GATEWAY || 'https://ipfs.io/ipfs/';
  return `${base}${cid}`;
}

export async function mockUpload(file: File): Promise<{ cid: string; sha256: string }> {
  const buf = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
  const hashArr = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
  
  // Generate a more realistic mock CID (bafy format)
  const mockCid = `bafybeig${hex.slice(0, 44)}`;
  
  return { cid: mockCid, sha256: hex };
}

// Real IPFS upload (using Pinata for hackathon demo)
export async function uploadToIPFS(file: File): Promise<{ cid: string; sha256: string }> {
  try {
    // Calculate SHA-256 first
    const buf = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
    const hashArr = Array.from(new Uint8Array(hashBuffer));
    const sha256 = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Upload to Pinata (free tier for demo)
    const formData = new FormData();
    formData.append('file', file);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
      customPinPolicy: {
        regions: [{ id: 'FRA1', desiredReplicationCount: 1 }]
      }
    });
    formData.append('pinataOptions', pinataOptions);

    const pinataMetadata = JSON.stringify({
      name: `VeriField-${file.name}-${Date.now()}`,
      keyvalues: {
        project: 'VeriField',
        sha256,
        uploadTime: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', pinataMetadata);

    // Use public Pinata endpoint (for demo only - in production, use your own API key)
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT || 'demo-key'}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const result = await response.json();
    return { cid: result.IpfsHash, sha256 };
  } catch (error) {
    console.warn('IPFS upload failed, falling back to mock:', error);
    return mockUpload(file);
  }
}

export async function smartUpload(file: File): Promise<{ cid: string; sha256: string; source: 'ipfs' | 'mock' }> {
  try {
    const result = await uploadToIPFS(file);
    return { ...result, source: 'ipfs' };
  } catch {
    const result = await mockUpload(file);
    return { ...result, source: 'mock' };
  }
}


