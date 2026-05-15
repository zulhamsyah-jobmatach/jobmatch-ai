import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// CV dummy untuk testing - nanti ini akan diganti dengan CV asli dari user
const dummyCvText = `
Nama: Zulhamsyah

Pendidikan:
- Universitas Terbuka (UT) Layanan Luar Negeri Kuala Lumpur
- Jurusan: Sistem Informasi
- Status: Sedang berjalan (Semester 6)

Pengalaman Kerja:
1. Shell Malaysia (saat ini, 3 tahun)
   - Posisi: Staff Pam Bensin & Cashier
   - Lingkungan kerja multinasional
   - Customer service & operational support

2. Kedai Yong Tou Fu, Malaysia (6 bulan)
   - Adaptasi awal bekerja di Malaysia
   - F&B service & customer interaction

3. Industri Perkapalan, Indonesia (1.5 tahun)
   - Posisi: Welder
   - Spesialisasi: welding jangkar dan komponen kapal
   - Pengalaman heavy industry

Skills Teknis:
- Microsoft Office (basic)
- Welding (kapal & jangkar)
- Customer service & cashiering
- Operational support

Bahasa:
- Indonesia (Native)
- Melayu (Fluent, hasil 3+ tahun di Malaysia)
- English (Basic conversational)
- Chinese/Mandarin (Basic)

Soft Skills:
- Leadership
- Communication & multicultural teamwork
- Adaptability (Indonesia ke Malaysia, 3 negara budaya)
- Customer-facing experience
- Cross-cultural communication

Sedang Belajar:
- Web Development (Next.js, React, TypeScript)
- Financial literacy & cryptocurrency
- Building digital products
- Sistem Informasi (kuliah)

Minat & Goals:
- Membangun usaha digital sendiri (startup)
- Financial independence & wealth building
- Filantropi: membangun yayasan untuk orang tua
- Cross-border opportunity Indonesia-Malaysia

Pengalaman Hidup yang Unik:
- 3+ tahun bekerja & tinggal di Malaysia
- Switched dari heavy industry (welding) ke service industry (Shell)
- Sedang transition ke tech & finance
- Multilingual (4 bahasa)
- Multicultural exposure (Indonesia, Malaysia, Tionghoa)
`;

const careerDiscoveryPrompt = `ROLE:
Kamu adalah Career Coach profesional berpengalaman 15 tahun, dengan spesialisasi membantu fresh graduate dan career switcher di Indonesia dan Malaysia menemukan jalur karir yang sesuai dengan potensi mereka.

CONTEXT:
User yang kamu hadapi biasanya:
- Fresh graduate yang bingung mau kerja di bidang apa
- Mereka sering ngerasa minder karena kurang pengalaman
- Mereka takut salah pilih karir
- Mereka butuh dukungan, bukan kritik

INPUT - CV USER:
${dummyCvText}

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

export async function GET() {
  try {
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
        raw_response: aiResponse,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Career Discovery berhasil!',
      cv_analyzed: 'Zulhamsyah (CV Dummy)',
      result: parsedResponse,
    });
  } catch (error) {
    console.error('Error calling Groq:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}