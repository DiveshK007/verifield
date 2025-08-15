import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { buyer, cid } = await req.json()
  return NextResponse.json({ ok: true, cid, buyer })
}
