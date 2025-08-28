import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assertEnv() {
  const required = ['VITE_CHAIN_ID','VITE_RPC_URL','VITE_STORAGE_GATEWAY'] as const
  const env = import.meta.env as Record<string, string>
  const missing = required.filter((k)=>!env[k])
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')}`)
}

export function getContracts(){
  const env = import.meta.env as Record<string, string>
  const dataNft = env.VITE_DATANFT_ADDRESS || ''
  const marketplace = env.VITE_MARKETPLACE_ADDRESS || ''
  if (!dataNft || !marketplace) {
    console.warn('Contracts not configured. Set VITE_DATANFT_ADDRESS and VITE_MARKETPLACE_ADDRESS')
  }
  return { dataNft, marketplace }
}

export async function hashSha256(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const bytes = new Uint8Array(digest)
  return Array.from(bytes).map((b)=>b.toString(16).padStart(2,'0')).join('')
}

export type UploadResult = { cid: string; sha256: string; source: 'ipfs'|'mock' }

async function uploadToIPFS(file: File): Promise<UploadResult> {
  const env = import.meta.env as Record<string, string>
  const jwt = env.VITE_PINATA_JWT
  if (!jwt) throw new Error('No Pinata JWT')
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })
  if (!res.ok) throw new Error('Pinata upload failed')
  const json = await res.json()
  const sha256 = await hashSha256(file)
  return { cid: json.IpfsHash, sha256, source: 'ipfs' }
}

async function mockUpload(file: File): Promise<UploadResult> {
  await new Promise((r)=>setTimeout(r, 600))
  const sha256 = await hashSha256(file)
  const cid = `bafy${sha256.slice(0,46)}`
  return { cid, sha256, source: 'mock' }
}

export async function smartUpload(file: File): Promise<UploadResult> {
  try { return await uploadToIPFS(file) } catch { return await mockUpload(file) }
}
