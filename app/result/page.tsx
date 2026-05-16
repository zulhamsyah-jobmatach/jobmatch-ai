'use client';

import { useEffect, useState } from 'react';

// Tipe data untuk hasil dari AI
type CareerRecommendation = {
  career: string;
  match_score: number;
  why_match: string;
  roadmap: string[];
};

type AIResult = {
  summary: string;
  recommendations: CareerRecommendation[];
  encouragement: string;
};

export default function ResultPage() {
  // State untuk menyimpan data dari AI
  const [data, setData] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect: jalan otomatis saat halaman pertama dibuka
  useEffect(() => {
    async function fetchAIData() {
      try {
        setLoading(true);
        const response = await fetch('/api/test-groq');
        const json = await response.json();

        if (json.success && json.result) {
          setData(json.result);
        } else {
          setError(json.error || 'Terjadi kesalahan');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchAIData();
  }, []); // [] berarti useEffect hanya jalan 1 kali

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with breadcrumb and action */}
        <div className="flex items-center justify-between mb-8">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Analisis Lagi
          </button>
        </div>

        {/* Main heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Analisis Selesai
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Hasil Analisis{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Karir Kamu
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI sudah menganalisis CV kamu dan menemukan jalur karir yang paling cocok berdasarkan keahlian dan minatmu.
          </p>
        </div>

        {/* Kondisi 1: Lagi loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              AI sedang menganalisis CV kamu...
            </p>
            <p className="text-sm text-gray-500">
              Mohon tunggu beberapa detik. Kami sedang mencari karir yang paling cocok untukmu.
            </p>
          </div>
        )}

        {/* Kondisi 2: Ada error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Ups, ada masalah
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Kondisi 3: Data sukses didapat */}
        {data && !loading && !error && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="relative bg-gradient-to-br from-white via-indigo-50/30 to-pink-50/30 rounded-3xl p-8 md:p-10 shadow-xl border border-indigo-100 overflow-hidden">
              {/* Decorative blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/40 to-pink-200/40 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="relative flex flex-col md:flex-row gap-6 items-start">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">
                    PROFIL KARIR KAMU
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                    Ringkasan Analisis
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {data.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🎯 Rekomendasi Karir
              </h2>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {rec.career}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {rec.match_score}/10
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{rec.why_match}</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Langkah-langkah:
                      </p>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        {rec.roadmap.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-indigo-600 to-pink-500 rounded-2xl p-8 shadow-lg text-white">
              <h2 className="text-xl font-bold mb-3">💪 Pesan untukmu</h2>
              <p className="leading-relaxed">{data.encouragement}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}