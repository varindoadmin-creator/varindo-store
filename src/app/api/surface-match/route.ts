import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const cloudinaryToken = process.env.CLOUDINARY_MCP_AUTH_TOKEN;
    if (!cloudinaryToken) {
      return NextResponse.json({ error: 'Visual search not configured' }, { status: 503 });
    }

    const mcpServers = (body.mcp_servers || []).map((server: any) => ({
      ...server,
      authorization_token: cloudinaryToken,
    }));

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'mcp-client-2025-04-04',
      },
      body: JSON.stringify({
        ...body,
        mcp_servers: mcpServers,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[surface-match] Anthropic error:', data);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[surface-match] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
