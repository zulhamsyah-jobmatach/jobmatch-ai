import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ANALYZER_SYSTEM_PROMPT = `Kamu adalah AI career coach yang menganalisis CV dan memberikan rekomendasi karir yang cocok.

TUGAS:
Analisis CV yang dikirim user, lalu kasih:
1. Summary singkat profil mereka (2-3 kalimat)
2. 3 rekomendasi karir yang paling cocok dengan skill & background mereka
3. Pesan motivasi yang personal & encouraging

ATURAN OUTPUT:
- HARUS return valid JSON object
- TIDAK BOLEH ada text di luar JSON
- TIDAK BOLEH pakai markdown code block

FORMAT JSON yang HARUS diikuti:
{
  "summary": "Profil singkat user dalam 2-3 kalimat",
  "recommendations": [
    {
      "career": "Nama karir",
      "match_score": 9,
      "why_match": "Penjelasan kenapa cocok (2-3 kalimat)",
      "roadmap": [
        "Step 1 konkret yang bisa dilakukan",
        "Step 2 konkret",
        "Step 3 konkret",
        "Step 4 konkret"
      ]
    }
  ],
  "encouragement": "Pesan motivasi personal untuk user (1-2 kalimat impactful)"
}

PANDUAN PENTING:
- match_score: skala 1-10 (urutkan dari tertinggi ke terendah)
- Buat 3 rekomendasi (urutkan: paling cocok dulu)
- Roadmap: 4 step actionable & konkret
- Bahasa: Indonesia santai, friendly tone
- Pertimbangkan: skill, pengalaman, pendidikan, posisi yang dituju`;

export async function POST(request: Request) {
  try {
    const { cvText } = await request.json();

    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { error: 'cvText harus berupa string' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: ANALYZER_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analisis CV berikut dan kasih rekomendasi karir:\n\n${cvText}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const rawResponse = completion.choices[0]?.message?.content || '{}';

    // Parse JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', rawResponse);
      return NextResponse.json(
        { error: 'AI response tidak valid. Coba lagi ya.' },
        { status: 500 }
      );
    }

    // Validasi struktur minimal
    if (
      !parsedResult.summary ||
      !Array.isArray(parsedResult.recommendations) ||
      !parsedResult.encouragement
    ) {
      return NextResponse.json(
        { error: 'Format hasil AI tidak lengkap. Coba lagi ya.' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Analyze CV text error:', error);
    return NextResponse.json(
      { error: 'Maaf, ada error saat analisis. Coba lagi ya!' },
      { status: 500 }
    );
  }
}