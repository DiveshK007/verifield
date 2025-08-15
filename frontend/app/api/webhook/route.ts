import { NextRequest, NextResponse } from 'next/server'
import { sponsoredUpload } from '@/lib/greenfield'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const title = String(form.get('title') || 'Dataset')
  const licenseUri = String(form.get('licenseUri') || 'https://opendatacommons.org/licenses/by/')
  const domain = String(form.get('domain') || 'climate')
  const tags = String(form.get('tags') || '')

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const up = await sponsoredUpload(file, { title, licenseUri, domain, tags })
  return NextResponse.json({ message: 'Uploaded to Greenfield (mock)', ...up, title, licenseUri, domain, tags })
}
