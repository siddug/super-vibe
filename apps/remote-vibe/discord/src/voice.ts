import { GoogleGenAI } from '@google/genai'
import { createLogger } from './logger.js'

// Mistral API types
interface MistralTranscriptionResponse {
  text: string
}

// Mistral transcription function
export async function transcribeAudioWithMistral({
  audio,
  prompt,
  language,
  temperature,
  mistralApiKey,
}: {
  audio: Buffer | Uint8Array | ArrayBuffer | string
  prompt?: string
  language?: string
  temperature?: number
  mistralApiKey?: string
}): Promise<string> {
  try {
    // Use provided API key or fall back to environment variable
    const apiKey = mistralApiKey || process.env.MISTRAL_API_KEY

    if (!apiKey) {
      throw new Error('Mistral API key is required for audio transcription')
    }

    // Convert audio to buffer if needed
    let audioBuffer: Buffer
    if (typeof audio === 'string') {
      audioBuffer = Buffer.from(audio, 'base64')
    } else if (audio instanceof Buffer) {
      audioBuffer = audio
    } else if (audio instanceof Uint8Array) {
      audioBuffer = Buffer.from(audio)
    } else if (audio instanceof ArrayBuffer) {
      audioBuffer = Buffer.from(audio)
    } else {
      throw new Error('Invalid audio format')
    }

    // Create form data for the request
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer]), 'audio.mp3')
    formData.append('model', 'pixtral-12b-2407') // Using Pixtral for audio transcription
    
    // Add prompt and language if provided
    const transcriptionPrompt = `Transcribe this audio accurately. The transcription will be sent to a coding agent (like Claude Code) to execute programming tasks.

Assume the speaker is using technical and programming terminology: file paths, function names, CLI commands, package names, API names, programming concepts, etc. Prioritize technical accuracy over literal transcription - if a word sounds like a common programming term, prefer that interpretation.

If the spoken message is unclear or ambiguous, rephrase it to better convey the intended meaning for a coding agent. The goal is effective communication of the user's programming intent, not a word-for-word transcription.

Here are relevant filenames and context that may appear in the audio:
<context>
${prompt || ''}
</context>
`

    formData.append('prompt', transcriptionPrompt)
    
    if (language) {
      formData.append('language', language)
    }

    // Make request to Mistral API
    const response = await fetch('https://api.mistral.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Mistral API error: ${response.status} - ${error}`)
    }

    const result = await response.json() as MistralTranscriptionResponse
    return result.text || ''
  } catch (error) {
    voiceLogger.error('Failed to transcribe audio with Mistral:', error)
    throw new Error(
      `Mistral audio transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

const voiceLogger = createLogger('VOICE')

export async function transcribeAudio({
  audio,
  prompt,
  language,
  temperature,
  geminiApiKey,
}: {
  audio: Buffer | Uint8Array | ArrayBuffer | string
  prompt?: string
  language?: string
  temperature?: number
  geminiApiKey?: string
}): Promise<string> {
  try {
    // Use provided API key or fall back to environment variable
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('Gemini API key is required as fallback for audio transcription when Mistral is unavailable')
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenAI({ apiKey })

    // Convert audio to base64 string if it's not already
    let audioBase64: string
    if (typeof audio === 'string') {
      audioBase64 = audio
    } else if (audio instanceof Buffer) {
      audioBase64 = audio.toString('base64')
    } else if (audio instanceof Uint8Array) {
      audioBase64 = Buffer.from(audio).toString('base64')
    } else if (audio instanceof ArrayBuffer) {
      audioBase64 = Buffer.from(audio).toString('base64')
    } else {
      throw new Error('Invalid audio format')
    }

    // Build the transcription prompt
    let transcriptionPrompt = `Transcribe this audio accurately. The transcription will be sent to a coding agent (like Claude Code) to execute programming tasks.

Assume the speaker is using technical and programming terminology: file paths, function names, CLI commands, package names, API names, programming concepts, etc. Prioritize technical accuracy over literal transcription - if a word sounds like a common programming term, prefer that interpretation.

If the spoken message is unclear or ambiguous, rephrase it to better convey the intended meaning for a coding agent. The goal is effective communication of the user's programming intent, not a word-for-word transcription.

Here are relevant filenames and context that may appear in the audio:
<context>
${prompt}
</context>
`
    if (language) {
      transcriptionPrompt += `\nThe audio is in ${language}.`
    }

    // Create the content with audio using the inline data format
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: transcriptionPrompt },
            {
              inlineData: {
                data: audioBase64,
                mimeType: 'audio/mpeg',
              },
            },
          ],
        },
      ],
      config:
        temperature !== undefined
          ? {
              temperature,
            }
          : undefined,
    })

    return response.text || ''
  } catch (error) {
    voiceLogger.error('Failed to transcribe audio:', error)
    throw new Error(
      `Audio transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
