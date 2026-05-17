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
    // Ambil data dari sessionStorage (disimpan saat upload)
    const storedResult = sessionStorage.getItem('cvAnalysisResult');

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setData(parsedResult);
        setLoading(false);
      } catch (err) {
        setError('Data hasil tidak valid');
        setLoading(false);
      }
    } else {
      // Kalau nggak ada data, redirect ke upload
      setError('Belum ada CV yang dianalisis. Silakan upload CV dulu.');
      setLoading(false);
    }
  }, []);

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

            {/* Recommendations Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold tracking-widest text-indigo-600">REKOMENDASI</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    Karir yang Cocok Untukmu
                  </h2>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                {data.recommendations.map((rec, index) => {
                  const isTop = index === 0;
                  return (
                    <div
                      key={index}
                      className={`relative rounded-3xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                        isTop
                          ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl shadow-pink-200'
                          : 'bg-white border border-gray-100 shadow-md hover:shadow-xl'
                      }`}
                    >
                      {isTop && (
                        <>
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
                          <div className="relative inline-flex items-center gap-1.5 mb-5 px-4 py-1.5 rounded-full bg-yellow-300 text-indigo-900 text-xs font-bold shadow-lg">
                            🏆 PALING COCOK UNTUKMU
                          </div>
                        </>
                      )}

                      <div className="relative">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                                isTop
                                  ? 'bg-white/20 backdrop-blur-md'
                                  : 'bg-gradient-to-br from-indigo-100 to-pink-100'
                              }`}
                            >
                              <span className="text-2xl">
                                {index === 0 ? '🚀' : index === 1 ? '💼' : '🎯'}
                              </span>
                            </div>
                            <div className="flex-1 pt-1">
                              <div
                                className={`text-xs font-bold tracking-wider mb-1 ${
                                  isTop ? 'text-yellow-200' : 'text-indigo-600'
                                }`}
                              >
                                REKOMENDASI #{index + 1}
                              </div>
                              <h3
                                className={`text-xl md:text-2xl font-extrabold ${
                                  isTop ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {rec.career}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Progress Bar */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-sm font-semibold ${
                                isTop ? 'text-white/90' : 'text-gray-700'
                              }`}
                            >
                              Tingkat Kesesuaian
                            </span>
                            <span
                              className={`text-lg font-extrabold ${
                                isTop ? 'text-yellow-200' : 'text-indigo-600'
                              }`}
                            >
                              {rec.match_score}/10
                            </span>
                          </div>
                          <div
                            className={`h-2.5 rounded-full overflow-hidden ${
                              isTop ? 'bg-white/20' : 'bg-gray-100'
                            }`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                isTop
                                  ? 'bg-gradient-to-r from-yellow-300 to-yellow-200'
                                  : 'bg-gradient-to-r from-indigo-500 to-pink-500'
                              }`}
                              style={{ width: `${rec.match_score * 10}%` }}
                            ></div>
                          </div>
                        </div>

                        <p
                          className={`leading-relaxed mb-6 ${
                            isTop ? 'text-white/90' : 'text-gray-600'
                          }`}
                        >
                          {rec.why_match}
                        </p>

                        {/* Roadmap */}
                        <div
                          className={`rounded-2xl p-5 ${
                            isTop
                              ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                              : 'bg-gradient-to-br from-gray-50 to-indigo-50/30 border border-gray-100'
                          }`}
                        >
                          <div
                            className={`text-xs font-bold tracking-widest mb-4 ${
                              isTop ? 'text-yellow-200' : 'text-indigo-600'
                            }`}
                          >
                            📋 ROADMAP UNTUK MEMULAI
                          </div>
                          <div className="space-y-3">
                            {rec.roadmap.map((step, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div
                                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isTop
                                      ? 'bg-yellow-300 text-indigo-900'
                                      : 'bg-gradient-to-br from-indigo-600 to-pink-500 text-white'
                                  }`}
                                >
                                  {i + 1}
                                </div>
                                <p
                                  className={`text-sm leading-relaxed pt-0.5 ${
                                    isTop ? 'text-white' : 'text-gray-700'
                                  }`}
                                >
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Encouragement */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-pink-200">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>

              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

              {/* Content */}
              <div className="relative p-8 md:p-12 text-white text-center">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-widest">
                  💛 PESAN UNTUKMU
                </div>

                <div className="relative max-w-2xl mx-auto px-4">
                  <svg className="mx-auto mb-4 w-12 h-12 text-yellow-300/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic mb-4">
                    {data.encouragement}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/80">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                  </svg>
                  <span className="font-semibold">Career Discovery powered by AI</span>
                </div>
              </div>
            </div>

            {/* Footer CTA Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coba lagi */}
              <button
                onClick={() => window.location.reload()}
                className="group relative overflow-hidden rounded-2xl p-6 bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 mb-0.5">Coba CV Lain</h3>
                    <p className="text-sm text-gray-500">Analisis ulang dengan profil berbeda</p>
                  </div>
                </div>
              </button>

              {/* Bagikan */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'JobMatch AI - Career Discovery',
                      text: 'Coba JobMatch AI, AI yang bantu kamu nemuin karir yang cocok!',
                      url: window.location.origin,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.origin);
                    alert('Link berhasil dicopy!');
                  }
                }}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-pink-500 hover:shadow-xl transition-all text-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold mb-0.5">Bagikan ke Teman</h3>
                    <p className="text-sm text-white/80">Bantu teman temukan karirnya</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Branding Footer */}
            <div className="mt-12 text-center pb-8">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">JobMatch AI</span>
                <span>—</span>
                <span>Career Discovery untuk Indonesia & Malaysia</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}