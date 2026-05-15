import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

// Bikin instance Groq dengan API key dari .env.local
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Function untuk handle GET request
export async function GET() {
  try {
    // Panggil Groq AI dengan pertanyaan test
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Halo! Tolong perkenalkan dirimu dalam 2 kalimat dalam Bahasa Indonesia.',
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    // Ambil response AI
    const aiResponse = chatCompletion.choices[0]?.message?.content || 'Tidak ada response';

    // Balikkan response ke browser
    return NextResponse.json({
      success: true,
      message: 'Groq API berhasil dipanggil!',
      ai_response: aiResponse,
    });
  } catch (error) {
    // Kalau ada error, balikkan info error
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