export async function sponsoredUpload(file: File, meta: any) {
  return {
    cid: 'greenfield://mock-cid-' + Math.random().toString(36).slice(2),
    sha256: '0x' + 'ab'.repeat(32),
    size: file.size,
  };
}

export async function grantDownload(cid: string, buyer: string) {
  return true;
}
