'use client';

import { useState } from 'react';

export default function JobMatchLanding() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    role: 'pencari-kerja',
  });

  const openModal = () => {
    setIsSubmitted(false);
    setFormData({ nama: '', email: '', whatsapp: '', role: 'pencari-kerja' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRegistration = {
      ...formData,
      registeredAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('jobmatch_registrations');
      const registrations = existing ? JSON.parse(existing) : [];
      registrations.push(newRegistration);
      localStorage.setItem('jobmatch_registrations', JSON.stringify(registrations));
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
    }

    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = [
    {
      number: '01',
      title: 'Upload CV',
      desc: 'Upload CV kamu dalam format PDF, DOC, atau DOCX. Cukup drag & drop, selesai dalam hitungan detik.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI Analisis',
      desc: 'AI kami menganalisis keahlian, pengalaman, dan preferensi kamu secara mendalam untuk mencari kecocokan terbaik.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Dapat Kerja',
      desc: 'Dapatkan rekomendasi pekerjaan terbaik yang sesuai dengan profil kamu, lengkap dengan tips untuk apply.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const features = [
    {
      title: 'AI Matching Canggih',
      desc: 'Algoritma machine learning yang dilatih dengan jutaan data pekerjaan untuk akurasi tertinggi.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Hasil dalam 2 Menit',
      desc: 'Tidak perlu menunggu berhari-hari. Dapatkan rekomendasi pekerjaan instan dengan AI kami.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Privasi Terjamin',
      desc: 'Data CV kamu dienkripsi end-to-end. Kami tidak pernah membagikan ke pihak ketiga tanpa izin.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Ribuan Perusahaan',
      desc: 'Terhubung dengan ribuan perusahaan terkemuka di Indonesia dan Asia Tenggara.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Rp 450.000',
      period: '/bulan',
      desc: 'Cocok untuk fresh graduate atau pencari kerja pemula.',
      features: [
        '5 CV upload per bulan',
        'Rekomendasi 10 pekerjaan',
        'AI matching dasar',
        'Email support',
      ],
      cta: 'Mulai Sekarang',
      highlight: false,
    },
    {
      name: 'Professional',
      price: 'Rp 1.560.000',
      period: '/bulan',
      desc: 'Untuk profesional yang serius mencari peluang terbaik.',
      features: [
        'CV upload tanpa batas',
        'Rekomendasi pekerjaan tanpa batas',
        'AI matching premium',
        'CV review oleh expert',
        'Priority support 24/7',
        'Interview coaching',
      ],
      cta: 'Pilih Professional',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Rp 4.700.000',
      period: '/bulan',
      desc: 'Solusi lengkap untuk tim HR dan recruiter perusahaan.',
      features: [
        'Semua fitur Professional',
        'Dashboard tim & analytics',
        'API access',
        'Custom AI training',
        'Dedicated account manager',
        'SLA 99.9% uptime',
      ],
      cta: 'Hubungi Sales',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              JobMatch AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#how" className="hover:text-indigo-600 transition">Cara Kerja</a>
            <a href="#features" className="hover:text-indigo-600 transition">Fitur</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Harga</a>
            <a href="#contact" className="hover:text-indigo-600 transition">Kontak</a>
          </div>
          <button
            onClick={openModal}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            Daftar Gratis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Dipercaya 50.000+ pencari kerja di Indonesia
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Temukan Pekerjaan<br />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-white bg-clip-text text-transparent">
              Impianmu dengan AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            Upload CV kamu, AI kami akan mencocokkan dengan pekerjaan terbaik dalam 2 menit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={openModal}
              className="group px-8 py-4 rounded-full bg-white text-indigo-600 font-bold text-lg shadow-2xl shadow-pink-900/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Coba Gratis Sekarang
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold backdrop-blur-md hover:bg-white/10 transition">
              Lihat Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Tanpa kartu kredit
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Setup 1 menit
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Batalkan kapan saja
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50K+', label: 'Pengguna Aktif' },
            { value: '2K+', label: 'Perusahaan Mitra' },
            { value: '95%', label: 'Akurasi Match' },
            { value: '2 Min', label: 'Rata-rata Waktu' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
              Cara Kerja
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              3 Langkah Mudah <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Menuju Karir Impian</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses simpel yang dirancang agar siapa pun bisa menemukan pekerjaan ideal tanpa ribet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"></div>

            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 group">
                <div className="relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-300 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold tracking-widest text-indigo-500 mb-2">LANGKAH {step.number}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-pink-50 text-pink-600 text-sm font-semibold">
              Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Kenapa Pilih <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">JobMatch AI?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dibangun dengan teknologi AI terbaru untuk memberikan pengalaman pencarian kerja yang revolusioner.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold">
              Pilihan Harga
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Paket untuk <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Setiap Kebutuhan</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Mulai gratis, upgrade kapan saja. Tanpa biaya tersembunyi.
            </p>

            <div className="inline-flex p-1 rounded-full bg-gray-100">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Tahunan <span className="text-pink-500">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl shadow-pink-300 md:scale-105'
                    : 'bg-white border border-gray-200 hover:shadow-xl'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-300 text-indigo-900 text-xs font-bold">
                    PALING POPULER
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/80' : 'text-gray-600'}`}>
                  {plan.desc}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-semibold mb-8 transition ${
                    plan.highlight
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-indigo-600 to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-yellow-300' : 'text-indigo-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight ? 'text-white' : 'text-gray-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Siap Menemukan Karir Impianmu?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Bergabung dengan ribuan profesional yang sudah merasakan kekuatan AI dalam mencari pekerjaan.
            </p>
            <button className="px-10 py-4 rounded-full bg-white text-indigo-600 font-bold text-lg shadow-2xl hover:scale-105 transition">
              Mulai Gratis Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">JobMatch AI</span>
              </div>
              <p className="text-sm leading-relaxed">
                Platform AI terdepan untuk mencocokkan talenta dengan pekerjaan impian di Indonesia.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition">Harga</a></li>
                <li><a href="#" className="hover:text-white transition">Untuk Perusahaan</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  zulhamsyah34@gmail.com
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +62 821-4502-3630
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Kuala Lumpur, Malaysia
                </li>
              </ul>

              <div className="flex gap-3 mt-5">
                {['linkedin', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href={social === 'linkedin' ? 'https://www.linkedin.com/in/zulham-syah-b5a2ba40a' : 'https://instagram.com/zulhamsyh_'}
        target="_blank"
        rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-pink-500 flex items-center justify-center transition"
                    aria-label={social}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'twitter' && <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />}
                      {social === 'linkedin' && <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />}
                      {social === 'instagram' && <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 011.25 1.25A1.25 1.25 0 0117.25 8 1.25 1.25 0 0116 6.75a1.25 1.25 0 011.25-1.25M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2026 JobMatch AI. Semua hak dilindungi.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Tutup"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-8 pt-8 pb-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Daftar Gratis</h3>
                    <p className="text-white/80 text-sm mt-1">
                      Mulai perjalanan karir impianmu hari ini
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 -mt-6 relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                    <div>
                      <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        id="nama"
                        name="nama"
                        type="text"
                        required
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nomor WhatsApp
                      </label>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+62 812-3456-7890"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Saya adalah
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm text-gray-900 bg-white"
                      >
                        <option value="pencari-kerja">Pencari Kerja</option>
                        <option value="perusahaan">Perusahaan</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] transition-all"
                    >
                      Daftar Sekarang
                    </button>

                    <p className="text-xs text-gray-500 text-center pt-1">
                      Dengan mendaftar, kamu menyetujui Syarat & Ketentuan kami.
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className="px-8 py-12 text-center">
                <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                  Terima kasih sudah mendaftar, <span className="font-semibold text-indigo-600">{formData.nama || 'teman'}</span>! Tim kami akan menghubungi kamu via WhatsApp dalam 1×24 jam.
                </p>
                <button
                  onClick={closeModal}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <a
        href="https://wa.me/6282145023630"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi via WhatsApp"
        className="fixed bottom-6 right-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></span>
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 hover:scale-110 transition-all duration-300">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
      </a>
    </div>
  );
}