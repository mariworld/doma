import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, walletAddress, networkId } = body

    if (!name || !walletAddress || !networkId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, walletAddress, networkId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMA_API_URL}/v1/prepare/tokenize/${name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.DOMA_API_KEY!,
        },
        body: JSON.stringify({
          walletAddress,
          networkId,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Doma API error:', data)
      return NextResponse.json(
        { error: data.message || 'Doma API error', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Tokenize route error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
