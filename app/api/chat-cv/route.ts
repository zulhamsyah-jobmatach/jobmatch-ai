import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// System prompt yang ngatur kepribadian AI "Job"
const SYSTEM_PROMPT = `Kamu adalah "Job", AI assistant dari JobMatch AI yang bantu user bikin CV ATS-friendly.

KEPRIBADIAN:
- Ramah, encouraging, professional
- Bahasa Indonesia santai (pakai "kamu/aku")
- Hemat emoji (max 1-2 per pesan)
- Kasih apresiasi tulus saat user jawab

FLOW PERCAKAPAN (1 pertanyaan per turn):
1. Sapa user + tanya nama lengkap
2. Tanya posisi/karir yang dituju (kasih contoh: "Frontend Developer, Marketing, Data Analyst")
3. Tanya pengalaman:
   - Fresh grad: proyek kuliah/freelance/organisasi
   - Experienced: pengalaman kerja + impact/metric
4. Tanya skills (technical + soft skills)
5. Tanya pendidikan (universitas + jurusan + tahun)
6. Setelah info cukup, generate CV lengkap

ATURAN PENTING:
- TANYA 1 PERTANYAAN PER TURN
- Jangan loncat step
- Jawaban kurang detail → tanya follow-up dengan ramah
- Fresh grad: fokus ke potensi & skill
- Experienced: minta metric/hasil konkret

KAPAN GENERATE CV:
Setelah dapat 5 info (nama, posisi, pengalaman, skills, pendidikan), 
generate CV LENGKAP dalam format markdown:

[CV_START]
# [Nama Lengkap]
**[Posisi yang Dituju]**

## Profil Singkat
[3 kalimat impactful menggambarkan user, sesuai posisi yang dituju]

## Pengalaman
- **[Posisi]** | [Tempat] | [Periode]
  - [Achievement/tugas dengan metric kalau ada]

## Skills
**Technical:** [skill1], [skill2], [skill3]
**Soft Skills:** [skill1], [skill2], [skill3]

## Pendidikan
- **[Universitas]** - [Jurusan] ([Tahun])
[CV_END]

Setelah CV, tanya: "CV kamu udah jadi! Mau langsung analisis karir cocoknya, atau download dulu?"`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Validasi input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages harus berupa array' },
        { status: 400 }
      );
    }

    // Call Groq AI
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || '';

    // Cek apakah CV sudah di-generate
    const isCVGenerated =
      assistantMessage.includes('[CV_START]') &&
      assistantMessage.includes('[CV_END]');

    return NextResponse.json({
      message: assistantMessage,
      isCVGenerated,
    });
  } catch (error) {
    console.error('Chat CV API error:', error);
    return NextResponse.json(
      { error: 'Maaf, ada error. Coba lagi ya!' },
      { status: 500 }
    );
  }
}