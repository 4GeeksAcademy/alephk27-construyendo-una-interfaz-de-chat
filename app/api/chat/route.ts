import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'El servidor no tiene configurada la clave de Groq.' },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la petición no es JSON válido.' }, { status: 400 })
  }

  if (!isChatRequest(body)) {
    return NextResponse.json(
      { error: 'La petición debe incluir un modelo y el historial de mensajes.' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, max_completion_tokens: 512 }),
      signal: request.signal,
    })
    const data: unknown = await response.json().catch(() => null)

    if (!response.ok) {
      const detail = getErrorMessage(data)
      return NextResponse.json(
        { error: detail ?? 'Groq rechazó la petición. Comprueba el modelo y los límites de uso.' },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo conectar con Groq. Inténtalo de nuevo.' },
      { status: 502 },
    )
  }
}

function isChatRequest(value: unknown): value is { model: string; messages: unknown[] } {
  if (typeof value !== 'object' || value === null) return false
  const request = value as Record<string, unknown>
  return (
    typeof request.model === 'string' &&
    request.model.trim().length > 0 &&
    Array.isArray(request.messages) &&
    request.messages.length > 0
  )
}

function getErrorMessage(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null
  const error = (value as Record<string, unknown>).error
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null) {
    const message = (error as Record<string, unknown>).message
    if (typeof message === 'string') return message
  }
  return null
}
