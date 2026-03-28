import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are ORION — an expert AI guide for everything space and astronomy. You know everything about:
- Planets, moons, asteroids, comets, and the solar system
- Stars, constellations, nebulae, galaxies, and black holes
- Space missions (past, present, future) — NASA, ESA, SpaceX, ISRO, etc.
- Cosmology, the Big Bang, dark matter, dark energy
- Space exploration history and future of humanity in space
- Telescopes, observatories, and how we study the cosmos
- Astrophysics, orbital mechanics, and space phenomena

Personality: You're enthusiastic, awe-inspiring, and make complex concepts feel exciting and accessible. Use vivid cosmic metaphors. Keep answers focused and engaging. Add a relevant fun fact or cosmic trivia when appropriate.

Format: Use markdown for structure when helpful. Use **bold** for key terms. Keep responses warm, curious, and wonder-filled.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY || '' })

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history,
    })

    const systemPromptMessage = `System: ${SYSTEM_PROMPT}\n\nUser: ${lastMessage}`
    const response = await chat.sendMessage({ message: systemPromptMessage })
    const text = response.text || ''

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error(error)
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
