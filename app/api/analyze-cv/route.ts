import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Ambil text CV dari body request
    const body = await request.json();
    const cvText = body.cvText;

    // Validasi
    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CV text tidak ditemukan' },
        { status: 400 }
      );
    }

    if (cvText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'CV terlalu pendek atau tidak terbaca dengan baik' },
        { status: 400 }
      );
    }

    if (cvText.length > 15000) {
      return NextResponse.json(
        { success: false, error: 'CV terlalu panjang, maksimal 15000 karakter' },
        { status: 400 }
      );
    }

    // Bikin prompt yang sama dengan test-groq sebelumnya
    const careerDiscoveryPrompt = `ROLE:
Kamu adalah Career Coach profesional berpengalaman 15 tahun, dengan spesialisasi membantu fresh graduate dan career switcher di Indonesia dan Malaysia menemukan jalur karir yang sesuai dengan potensi mereka.

CONTEXT:
User yang kamu hadapi biasanya:
- Fresh graduate yang bingung mau kerja di bidang apa
- Mereka sering ngerasa minder karena kurang pengalaman
- Mereka takut salah pilih karir
- Mereka butuh dukungan, bukan kritik

INPUT - CV USER:
${cvText}

TASK:
Analisa CV di atas dan berikan rekomendasi 3 (tiga) jalur karir yang paling cocok. Untuk setiap rekomendasi, jelaskan:
1. Nama bidang karir (spesifik, bukan umum)
2. Kenapa cocok berdasarkan CV mereka (sebutkan kekuatan spesifik)
3. Roadmap singkat 3 langkah untuk mulai di bidang ini
4. Tingkat kesesuaian (skala 1-10) dengan penjelasan

OUTPUT FORMAT:
Balas HANYA dalam format JSON valid berikut, tanpa markdown atau teks tambahan apa pun:

{
  "summary": "Ringkasan singkat tentang kekuatan utama user (2 kalimat)",
  "recommendations": [
    {
      "career": "nama bidang karir",
      "match_score": 9,
      "why_match": "alasan spesifik kenapa cocok berdasarkan CV",
      "roadmap": [
        "langkah pertama yang konkret",
        "langkah kedua",
        "langkah ketiga"
      ]
    }
  ],
  "encouragement": "Pesan singkat yang membangun confidence user (1-2 kalimat)"
}

CONSTRAINTS:
- Gunakan Bahasa Indonesia yang ramah dan supportif
- JANGAN gunakan istilah teknis yang membingungkan
- Hindari kata-kata yang membuat user merasa minder
- Roadmap harus konkret dan actionable
- Match score harus realistis (jangan semuanya 10)
- Total recommendations: 3 (tidak kurang, tidak lebih)

TONE:
Supportif, hangat, dan membangun confidence. Bayangkan kamu lagi ngobrol dengan teman dekat yang lagi bingung pilih karir.`;

    // Panggil Groq AI
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: careerDiscoveryPrompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '{}';

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'AI response bukan JSON valid',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Analisis CV berhasil!',
      result: parsedResponse,
    });
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}