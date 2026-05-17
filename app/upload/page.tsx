'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    if (selectedFile.type !== 'application/pdf') {
      setError('Format file harus PDF ya!');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File terlalu besar! Maksimal 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Function: Extract text dari PDF pakai pdfjs-dist
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Import dinamis - load library cuma saat dibutuhin
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source - WAJIB untuk pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Step 1: Membaca PDF
      setLoadingStep('reading');
      const cvText = await extractTextFromPDF(file);

      if (!cvText || cvText.length < 50) {
        throw new Error('PDF kosong atau tidak bisa dibaca dengan baik. Pastikan PDF kamu text-based (bukan hasil scan).');
      }

      // Step 2: Kirim ke AI
      setLoadingStep('analyzing');
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvText }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'AI gagal menganalisis CV');
      }

      // Step 3: Save hasil ke sessionStorage
      setLoadingStep('redirecting');
      sessionStorage.setItem('cvAnalysisResult', JSON.stringify(data.result));
      sessionStorage.setItem('cvFileName', file.name);

      // Wait sebentar biar smooth transition
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 4: Redirect ke result
      router.push('/result');
    } catch (err) {
      setIsAnalyzing(false);
      setLoadingStep('');
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
        </div>

        {/* Main heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
            🚀 Career Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Upload{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              CV Kamu
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            AI akan menganalisis CV kamu dan kasih rekomendasi karir yang paling cocok dalam hitungan detik.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="py-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">
                      {loadingStep === 'reading' && '📖'}
                      {loadingStep === 'analyzing' && '🤖'}
                      {loadingStep === 'redirecting' && '✨'}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {loadingStep === 'reading' && 'Membaca CV kamu...'}
                  {loadingStep === 'analyzing' && 'AI sedang menganalisis...'}
                  {loadingStep === 'redirecting' && 'Hasil siap!'}
                </h3>
                <p className="text-gray-500 text-center">
                  {loadingStep === 'reading' && 'Mengekstrak informasi dari PDF kamu'}
                  {loadingStep === 'analyzing' && 'Career Coach AI sedang mencari karir terbaik untukmu'}
                  {loadingStep === 'redirecting' && 'Mengarahkan ke halaman hasil...'}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  loadingStep === 'reading' ? 'bg-indigo-50 border border-indigo-200' : 'opacity-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    loadingStep === 'reading' ? 'bg-indigo-600' : 'bg-green-500'
                  }`}>
                    {loadingStep === 'reading' ? '1' : '✓'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Membaca PDF</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  loadingStep === 'analyzing' ? 'bg-indigo-50 border border-indigo-200' : 'opacity-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    loadingStep === 'analyzing' ? 'bg-indigo-600' : loadingStep === 'redirecting' ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {loadingStep === 'analyzing' ? '2' : loadingStep === 'redirecting' ? '✓' : '2'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Analisis AI</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  loadingStep === 'redirecting' ? 'bg-indigo-50 border border-indigo-200' : 'opacity-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    loadingStep === 'redirecting' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-700">Menyiapkan hasil</span>
                </div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && !isAnalyzing && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Ada masalah</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* DROP ZONE (kalau belum ada file dan nggak lagi analyzing) */}
          {!file && !isAnalyzing && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50 scale-[1.02]'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isDragging ? 'Lepaskan di sini!' : 'Drag & Drop CV kamu di sini'}
              </h3>
              <p className="text-gray-500 mb-4">atau klik untuk pilih file</p>

              <div className="inline-flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Format: PDF
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Maksimal 5MB
                </span>
              </div>
            </div>
          )}

          {/* FILE PREVIEW (kalau udah ada file dan nggak lagi analyzing) */}
          {file && !isAnalyzing && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl border border-indigo-100">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xs">PDF</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{file.name}</h4>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                <button
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition border border-gray-200"
                  title="Hapus file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analisis CV Sekarang
              </button>

              <p className="text-center text-xs text-gray-500">
                ✨ Analisis butuh waktu sekitar 10-15 detik
              </p>
            </div>
          )}
        </div>

        {/* Trust indicators (cuma tampil kalau nggak lagi analyzing) */}
        {!isAnalyzing && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">100% Privat</h4>
                <p className="text-xs text-gray-500">CV kamu aman</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Super Cepat</h4>
                <p className="text-xs text-gray-500">Hasil dalam detik</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">AI Premium</h4>
                <p className="text-xs text-gray-500">Akurasi tinggi</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}